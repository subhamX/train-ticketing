-- TRIGGER 1: create a new table and add seats to this table on addition of a new train into train_instance
create or replace function handle_on_new_train_instance()
    returns trigger
    language plpgsql
    as
$$
declare
    train_table_name_PREFIX varchar(50):='train';
    train_table_name varchar(100);
    number_of_ac_coaches integer;
    ac_coach_id integer;
    ac_coach_composition_table_name varchar(100);
    ac_coach_prefix char(1):='A';

    sleeper_coach_id integer;
    number_of_sleeper_coaches integer;
    sleeper_coach_composition_table_name varchar(100);
    sleeper_coach_prefix char(1):='S';

    temp varchar(10);
    berth record;
	i int;
    table_exist_flag boolean;
begin

    ac_coach_id=NEW.ac_coach_id;
    sleeper_coach_id=NEW.sleeper_coach_id;
    number_of_ac_coaches=NEW.number_of_ac_coaches;
    number_of_sleeper_coaches=NEW.number_of_sleeper_coaches;

    -- checking if coachid is valid
    SELECT EXISTS (
        SELECT FROM coaches
        WHERE coach_id=ac_coach_id
    )
    into table_exist_flag;

    if not table_exist_flag then
        raise exception 'Invalid AC Coach ID %', ac_coach_id;
    end if;

    SELECT EXISTS (
        SELECT FROM coaches
        WHERE coach_id=sleeper_coach_id
    )
    into table_exist_flag;

    if not table_exist_flag then
        raise exception 'Invalid Sleeper Coach ID %', ac_coach_id;
    end if;


    train_table_name=train_table_name_PREFIX || '_' || NEW.train_number || '_' || to_char(NEW.journey_date,'ddmmyyyy');
    -- create a new table named train_{train_number}_{DDMMYY}
    execute format(
        'create table %I(
            seat_number int,
            coach_number varchar(10),
            pnr_number varchar(10),
            passenger_name varchar(100),
            passenger_age int,
            passenger_gender char,
            primary key(
                seat_number, coach_number
            )
        )', train_table_name
    );

    execute format('ALTER TABLE %I 
        ADD FOREIGN KEY("pnr_number")
        REFERENCES "tickets" ("pnr_number")', train_table_name);



    -- handling for AC coaches
    -- retrieving the ac_composition table name
    select composition_table
    into ac_coach_composition_table_name
    from coaches
    where coach_id=ac_coach_id;

    -- adding seats for every AC coach 
    i=0;
    while i<number_of_ac_coaches
    loop
        for berth in execute format(
            'select * from %I', ac_coach_composition_table_name
        )
        loop
            temp=ac_coach_prefix || (i+1);
            raise info 'INSERTING: %, %',temp, berth.berth_number;
            execute format(
                'INSERT INTO %I(
                    seat_number,
                    coach_number
                )
                VALUES(
                    %L,
                    %L
                )', train_table_name, berth.berth_number, temp
            );
        end loop;
        i=i+1;    
    end loop;

    -- handling for sleeper coaches
    -- retrieving the sleeper_composition table name
    select composition_table
    into sleeper_coach_composition_table_name
    from coaches
    where coach_id=ac_coach_id;

    -- adding seats for every sleeper coach 
    i=0;
    while i<number_of_sleeper_coaches
    loop
        for berth in execute format(
            'select * from %I', sleeper_coach_composition_table_name
        )
        loop
            temp=sleeper_coach_prefix || (i+1);
            raise info 'INSERTING: %, %',temp, berth.berth_number;
            execute format(
                'INSERT INTO %I(
                    seat_number,
                    coach_number
                )
                VALUES(
                    %L,
                    %L
                )', train_table_name, berth.berth_number, temp
            );
        end loop;
        i=i+1;    
    end loop;

    return NEW;
end
$$;

-- linking the trigger function to the table
create trigger new_train_instance_trigger
    before insert
    on train_instance
    for each row
    execute procedure handle_on_new_train_instance();


-- TRIGGER 2: checks if the composition table exists or not on addition of a new entry in coaches table
create or replace function on_coaches_insert()
returns trigger
language plpgsql
as
$$
declare
	coach_table_PREFIX varchar(30):='coach_composition_';
	temp boolean;
    coach_composition_table_name varchar(100);
begin

    if NEW.composition_table is not NULL then
        SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name   = NEW.composition_table
        )
        into temp;
        
        if temp is false then
            raise exception 'Coach Table Name: % doesn''t exist. Consider creating one and then add an entry or leave it NULL', NEW.composition_table;
        else
            raise info 'Composition table: % exist', NEW.composition_table;
            -- Binding Trigger
            execute format('create trigger alter_coach_instance_trigger
                before insert or delete on %I
                for each row
                execute procedure on_coach_composition_change();
            ', NEW.composition_table);
        end if;
    else
        coach_composition_table_name:= coach_table_PREFIX || NEW.coach_id;

        raise info 'Creating Table: %', coach_composition_table_name;
        execute format('CREATE TABLE %I(
            berth_number integer,
            berth_type varchar(3),
            primary key(berth_number)
        )', coach_composition_table_name);

        UPDATE coaches
        SET composition_table=coach_composition_table_name
        where coach_id=NEW.coach_id;

        raise info 'Binding trigger to %', coach_composition_table_name;
        -- Binding Trigger
        execute format('create trigger alter_coach_instance_trigger
            before insert or delete on %I
            for each row
            execute procedure on_coach_composition_change();
        ', coach_composition_table_name);

        NEW.composition_table=coach_composition_table_name;
    end if;
	
	return NEW;
end
$$;

create trigger new_coach_instance_trigger
    before insert on coaches
    for each row
    execute procedure on_coaches_insert();


-- TRIGGER 3: if coach_composition is changed then it insert seats into 
-- all train_{train_number}_{DDMMYYYY} tables inside train_instances 
-- allows addition of records but doesn't allow deletion

-- *NOTE: add this trigger on the coach_composition_{coach_id} table whenever created
-- * TRIGGER 2 binds this trigger;
create or replace function on_coach_composition_change()
returns trigger
language plpgsql
as
$$
declare
	table_name varchar(400);
	temp integer;
	i record;
	j integer;
	ac_coach_PREFIX char(1):='A';
	sleeper_coach_PREFIX char(1):='S';
    train_table_name_PREFIX varchar(50):='train_';
	train_table_name varchar(1000);
    coach_number varchar(100);
    pnr_number varchar(400);
begin
    -- prohibiting user from deleting
    if NEW is NULL then
        raise exception 'Deleting a record is prohibited. Consider creating a new composition table!';
    end if;

	table_name:=TG_TABLE_NAME;

    -- handling for ac coaches
	for i in (select number_of_ac_coaches, train_number, journey_date
		 from train_instance, coaches
		 where coaches.coach_id=train_instance.ac_coach_id
		 and composition_table=TG_TABLE_NAME)
	loop
    	train_table_name=train_table_name_PREFIX || i.train_number || '_' || to_char(i.journey_date,'ddmmyyyy');
		j=0;
		temp:=i.number_of_ac_coaches;
		while j<temp 
		loop
            coach_number=ac_coach_PREFIX || (j+1);
            -- insert
            execute format('INSERT INTO %I(
                seat_number,
                coach_number                    
                )
                VALUES(%L, %L)',
                train_table_name,
                NEW.berth_number,
                coach_number
            );
            raise info 'INSERTING: % % in table %', NEW.berth_number, coach_number, train_table_name;
			j=j+1;
		end loop;
	end loop;

    -- handling for sleeper coaches
    for i in (select number_of_sleeper_coaches, train_number, journey_date
		 from train_instance, coaches
		 where coaches.coach_id=train_instance.sleeper_coach_id
		 and composition_table=TG_TABLE_NAME)
	loop
    	train_table_name=train_table_name_PREFIX || i.train_number || '_' || to_char(i.journey_date,'ddmmyyyy');
		j=0;
		temp:=i.number_of_sleeper_coaches;
		while j<temp 
		loop
            coach_number=sleeper_coach_PREFIX || (1+j);
            execute format('INSERT INTO %I(
                seat_number,
                coach_number                    
                )
                VALUES(%L, %L)',
                train_table_name,
                NEW.berth_number,
                coach_number
            );
            raise info 'INSERTING: % % in table %', NEW.berth_number, coach_number, train_table_name;
			j=j+1;
		end loop;
	end loop;

    return NEW;
end
$$;

-- * Dynamically binded with the composition table by trigger 2
-- create trigger alter_coach_instance_trigger
-- 	before insert or delete on <<COACH_COMPOSITION_TABLE_NAME>>
-- 	for each row
-- 	execute procedure on_coach_composition_change();
	


-- TRIGGER 4: 
-- It forces that train_number, journey_date, ac_coach_id and sleeper_coach_id cannot be altered
-- only number of coaches can be increased
create or replace function handle_on_train_instance_update()
returns trigger
language plpgsql
as
$$
declare
    train_table_name varchar(200);
    ac_coach_composition_table_name varchar(100);
    sleeper_coach_composition_table_name varchar(100);
    coach_number varchar(10);
    starti integer;
    endi integer;
    berth record;
    train_table_name_PREFIX varchar(100):='train_';
	ac_coach_PREFIX char(1):='A';
	sleeper_coach_PREFIX char(1):='S';
begin
    if NEW.ac_coach_id <> OLD.ac_coach_id then
        raise exception 'AC Coach ID cannot be changed!';
    elsif NEW.sleeper_coach_id <> OLD.sleeper_coach_id then
        raise exception 'Sleeper Coach ID cannot be changed!';
    elsif NEW.train_number <> OLD.train_number then
        raise exception 'Train Number is read only!';
    elsif NEW.journey_date <> OLD.journey_date then
        raise exception 'Journey Date is read only!';
    end if;

    train_table_name=train_table_name_PREFIX || NEW.train_number || '_' || to_char(NEW.journey_date,'ddmmyyyy');

    if NEW.number_of_ac_coaches > OLD.number_of_ac_coaches then
        -- insert records
        select composition_table
        into ac_coach_composition_table_name
        from coaches
        where coach_id=NEW.ac_coach_id;

        for berth in execute format(
            'select * from %I', ac_coach_composition_table_name
        )
        loop
            starti=OLD.number_of_ac_coaches+1;
            endi=NEW.number_of_ac_coaches;
            while starti<=endi
            loop
            -- adding seats for every ac coach 
                coach_number=ac_coach_PREFIX || (starti);

                execute format('INSERT INTO %I(
                    seat_number,
                    coach_number                    
                    )
                    VALUES(%L, %L)',
                    train_table_name,
                    berth.berth_number,
                    coach_number
                );
                starti=starti+1;
            end loop;
        end loop;
    elsif  NEW.number_of_ac_coaches < OLD.number_of_ac_coaches then
        raise exception 'Number of AC coaches cannot be reduced!';
    end if;


    if NEW.number_of_sleeper_coaches > OLD.number_of_sleeper_coaches then
        -- insert records
        select composition_table
        into sleeper_coach_composition_table_name
        from coaches
        where coach_id=NEW.sleeper_coach_id;

        for berth in execute format(
            'select * from %I', sleeper_coach_composition_table_name
        )
        loop
            starti=OLD.number_of_sleeper_coaches+1;
            endi=NEW.number_of_sleeper_coaches;
            while starti<=endi
            loop
            -- adding seats for every ac coach 
                coach_number=sleeper_coach_PREFIX || (starti);

                execute format('INSERT INTO %I(
                    seat_number,
                    coach_number                    
                    )
                    VALUES(%L, %L)',
                    train_table_name,
                    berth.berth_number,
                    coach_number
                );
                starti=starti+1;
            end loop;
        end loop;
    elsif  NEW.number_of_sleeper_coaches < OLD.number_of_sleeper_coaches then
        raise exception 'Number of Sleeper coaches cannot be reduced!';
    end if;

    return NEW;
end
$$;


create trigger train_instance_update_trigger
    before update on train_instance
    for each row
    execute procedure handle_on_train_instance_update();


-- TRIGGER 5: if any row in coaches are deleted then the following trigger
--  deletes the coach_composition corresponding to it
create or replace function handle_on_coach_delete()
	returns trigger
	language plpgsql
	as
$$
declare
	coach_composition_table_name text;
begin
	coach_composition_table_name = OLD.composition_table;
	execute format('drop table %I', coach_composition_table_name);
	raise info 'Successfully deleted %', coach_composition_table_name;
	
	return OLD;
end
$$;


create trigger on_coach_delete
	before delete
	on coaches
	for each row
	execute procedure handle_on_coach_delete();



-- TRIGGER 5: if any row in train_instance is deleted then the following trigger
--  deletes the train_table corresponding to it
create or replace function handle_on_train_instance_delete()
	returns trigger
	language plpgsql
	as
$$
declare
	train_table_name text;
begin
	select get_train_table_name('train_'::text, OLD.train_number, OLD.journey_date)
	into train_table_name;

	execute format('drop table %I', train_table_name);
	raise info 'Successfully deleted %', train_table_name;

	return OLD;
end
$$;


create trigger on_train_instance_delete
	before delete
	on train_instance
	for each row
	execute procedure handle_on_train_instance_delete();