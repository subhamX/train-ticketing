
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

	-- berth_details.coach_number will either have A% type or S% type
	-- update tickets count in train_instance
	if berth_details.coach_number LIKE 'A%' then
		execute format('UPDATE train_instance
			SET available_ac_tickets=available_ac_tickets+ %L
			WHERE train_number=%L
			AND journey_date=%L', 
			array_length(seats, 1),
			ticket_details.train_number, ticket_details.journey_date);
	else
		execute format('UPDATE train_instance
			SET available_sleeper_tickets=available_sleeper_tickets + %L
			WHERE train_number=%L
			AND journey_date=%L', 
			array_length(seats, 1),
			ticket_details.train_number, ticket_details.journey_date);
	end if;	
end
$$;
