DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'passenger') THEN
		create type passenger as (passenger_name text, 
			passenger_age int, 
			passenger_gender char, 
			seat_number int, 
			coach_number text, 
			seat_pref text);
    END IF;
END$$;




create or replace procedure book_tickets(
	INOUT passengers passenger[],
 	INOUT train_number text,	
	INOUT journey_date date,
	IN username text,
	-- A for AC and S for sleeper
	INOUT type char,
	INOUT transaction_number text,	
	INOUT ticket_fare numeric(50, 5),
	-- 0 -> Book with no pref
	-- 1 -> Book with preference:seat type
	-- 2 -> Book with coach_number and seat_number
	INOUT method integer default 0, 
	INOUT pnr_number varchar(20) default null
)
language plpgsql
as
$$
declare
	train_details record;
	instance passenger;
	ticket_details record;
	i record;
	train_table_name text;
    number_of_seats integer;
    index integer;
begin
	-- checking if pnr_number is NULL
	-- It should be NULL as the procedure will allocate the PNR number and not the caller.
	if pnr_number IS NOT NULL then
		raise exception 'Invalid argument PNR Number';
	end if;
	
	-- checking if the train & jouney date has an instance in train_instance and current time is ok for booking
	execute format('select *
	from train_instance
	where train_instance.train_number=%L
	and train_instance.journey_date=%L', train_number, journey_date)
	into train_details;
	
	
 	if train_details is NULL then
 		raise exception 'Invalid attempt to book ticket in % train on %', train_number, journey_date;
 	end if;

	 if train_details.booking_start_time > now() then
	 	raise exception 'Sorry booking isn''t started yet.';
	 elsif train_details.booking_end_time < now() then
	 	raise exception 'Sorry you missed the booking deadline. 😢';
	 end if;
	
	-- Please note that we are not validating the ticket_fare.
	-- It should be done at the server. As the database is only accessible from
	-- the server. It's very safe to assume that the ticket_fare is correct, and verified.
	-- Generate a new ticket
	execute format('INSERT INTO tickets(ticket_fare, train_number, username, transaction_number, journey_date)
	values(%L, %L, %L, %L, %L) returning *', ticket_fare, train_number, username, transaction_number, journey_date)
	into ticket_details;
	
	pnr_number=ticket_details.pnr_number;

	select get_train_table_name('train_'::text, train_number, journey_date)
	into train_table_name;

	-- check if the coach type is correct
    if type NOT IN ('A', 'S') then
        raise exception 'type % is invalid; Only A for AC and S for Sleeper are valid ones', type;
    end if;

    type=type || '%';

	-- method=0 refers to book a ticket and allot any seats without any preference  
	if method=0 then
		-- fetching the number of seats available
		if type='A%' then
			execute format('SELECT available_ac_tickets
				FROM train_instance
				WHERE train_number=%L
				AND journey_date=%L', 
				train_number, journey_date)
			INTO number_of_seats;
		else
			execute format('SELECT available_sleeper_tickets
				FROM train_instance
				WHERE train_number=%L
				AND journey_date=%L', 
				train_number, journey_date)
			INTO number_of_seats;
		end if;

		-- if number of seats needed are atleast available 
        if number_of_seats < array_length(passengers, 1) then
            raise exception 'Only % tickets left', number_of_seats;
        end if;

        index=1;
		-- booking all tickets
        for i in execute format('select seat_number, coach_number 
                    from %I
                    where pnr_number is %L
                    and coach_number LIKE %L
                    LIMIT %L', train_table_name, NULL, type, array_length(passengers, 1))
        loop
            instance=passengers[index];
        
            execute format ('UPDATE %I
                SET passenger_age=%L,
                passenger_name=%L,
                passenger_gender=%L,
                pnr_number=%L
                WHERE seat_number=%L
                AND coach_number=%L', train_table_name, instance.passenger_age,
                instance.passenger_name,instance.passenger_gender,
                pnr_number,i.seat_number,i.coach_number);
            
            instance.coach_number=i.coach_number;
            instance.seat_number=i.seat_number;
			passengers[index]=instance;
            index=index+1;
        end loop;
		
		-- update tickets count in train_instance
		if type='A%' then
			execute format('UPDATE train_instance
				SET available_ac_tickets=available_ac_tickets- %L
				WHERE train_number=%L
				AND journey_date=%L', 
				array_length(passengers, 1),
				train_number, journey_date);
		else
			execute format('UPDATE train_instance
				SET available_sleeper_tickets=available_sleeper_tickets- %L
				WHERE train_number=%L
				AND journey_date=%L', 
				array_length(passengers, 1),
				train_number, journey_date);
		end if;
	else
		raise exception 'Method not yet incorporated!, Passenger: %', instance;
	end if;
end
$$;
