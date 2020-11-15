-- * Snippet to drop the complete schema and create a new one 
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION generate_pnr_number(size INT, table_name text, pk_attribute text, times INT DEFAULT 0) 
RETURNS TEXT 
LANGUAGE plpgsql AS 
$$
DECLARE
    characters TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
    bytes BYTEA := gen_random_bytes(size);
    l INT := length(characters);
    i INT := 0;
    output TEXT := '';
    flag bool;
BEGIN
    IF times >5 then
        raise exception 'Unable to generate random id!';
    end if;

    WHILE i < size LOOP
        output := output || substr(characters, get_byte(bytes, i) % l + 1, 1);
        i := i + 1;
    END LOOP;

    execute format('SELECT EXISTS (
        SELECT *
        FROM %I
        WHERE %I=%L
        )', table_name, pk_attribute, output)
    into flag;

    if flag=true then
        raise info 'Collision Occured % times', times;
        return get_random_id(size, table_name, pk_attribute, times+1);
    else
        RETURN output;
    end if;
END;
$$;



create or replace function get_train_table_name(
	IN train_table_name_PREFIX text,
	IN train_number varchar(100),
	IN journey_date date,
	OUT train_table_name varchar(200)
)
language plpgsql
as
$$
begin
	train_table_name=train_table_name_PREFIX || train_number || '_' || to_char(journey_date,'ddmmyyyy');
end
$$;


-- function to cancel berths
-- Example: select cancel_berths(pnr_number=>'54ovvsy7kr', seats=>array[4, 3], coach_numbers=>array['A2', 'A2']);
create or replace function cancel_berths(
	INOUT pnr_num text,
    INOUT user_name text,
	IN seats integer[],
	IN coach_numbers text[]
)
language plpgsql as
$$
declare
	ticket_details record;
	i integer;
	train_table_name text;
	berth_details record;
begin
	SELECT train_number, journey_date
	FROM tickets
	where pnr_number=pnr_num
    and username=user_name
	into ticket_details;
	
	select get_train_table_name('train_'::text, ticket_details.train_number, ticket_details.journey_date)
	into train_table_name;
	
	-- check if the pnr is valid
	if ticket_details IS NULL then
		raise exception 'Invalid Details';
	end if;
	
	if array_upper(seats, 1) <> array_upper(coach_numbers, 1) then
		raise exception 'Seats and coaches array length is not same';
	end if;

	for i in array_lower(seats, 1)..array_upper(seats, 1) loop
		execute format('UPDATE %I as x
			SET pnr_number=NULL,
			passenger_name=NULL,
			passenger_age=NULL
			from %I y
			where x.pnr_number=%L
			and x.pnr_number = y.pnr_number
			and x.seat_number = y.seat_number
			and x.coach_number = y.coach_number
		    and x.seat_number=%L
			and x.coach_number=%L
			returning y.seat_number, y.coach_number, y.pnr_number, y.passenger_name, y.passenger_age, y.passenger_gender;', 
		   train_table_name, train_table_name, pnr_num, seats[i], coach_numbers[i]
		  ) into berth_details;
		raise info '%', berth_details;
		if berth_details IS NULL then
			raise exception 'Seat Number % and Coach Number % doesn''t belong to PNR %', seats[i], coach_numbers[i], pnr_num;
		end if;
		
		INSERT INTO cancelled_berths(seat_number, 
			coach_number,
			 pnr_number, passenger_name, 
			passenger_age, passenger_gender
		)VALUES(berth_details.seat_number, berth_details.coach_number, berth_details.pnr_number, berth_details.passenger_name, berth_details.passenger_age, berth_details.passenger_gender);
		raise info '% %', seats[i], coach_numbers[i];
	end loop;
end
$$;
