
-- function to cancel berths
-- Example: select cancel_berths(user_name=>'jaihanuman', pnr_num=>'54ovvsy7kr', seats=>array[4, 3], coach_numbers=>array['A2', 'A2']);
create or replace function cancel_berths(
	INOUT pnr_num text,
    INOUT user_name text,
	OUT new_refund_amount decimal,
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
	curr_refund_amount decimal;
	refund_factor decimal;
	temp record;
	number_of_passengers int;
	attribute_name text;
	ticket_cost decimal;
	departure_time text;
	source_departure_timestamp timestamp;	
begin
	SELECT train_number, journey_date
	FROM tickets
	where pnr_number=pnr_num
    and username=user_name
	into ticket_details;
	
	select get_train_table_name('train_'::text, ticket_details.train_number, ticket_details.journey_date)
	into train_table_name;
	
	raise info 'Train Table Name: %', train_table_name;
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

	-- finding the attribute name
	if berth_details.coach_number LIKE 'A%' then
		attribute_name = 'ac_ticket_fare';
	else
		attribute_name = 'sleeper_ticket_fare';
	end if;

	number_of_passengers=array_length(seats, 1);
	
	-- fetch ticket cost and source departure time
	execute format('select %I, source_departure_time
		from trains
		where train_number=%L', attribute_name, ticket_details.train_number)
		into ticket_cost, departure_time;

	source_departure_timestamp = (ticket_details.journey_date || ' ' || departure_time || '+05:30')::timestamp;

	raise info 'Source Departure Timestamp: %', source_departure_timestamp;
	-- checking if this cancellation is valid
	if source_departure_timestamp < now() then
		raise exception 'Cannot Cancel ticket after train has departed from source!';
	end if;	

	-- calculate refund amount
	if source_departure_timestamp - now() > interval '24 hour' then
		refund_factor=0.9;
	else
		refund_factor=0.8;	
	end if;
	raise info 'Refund factor is %', refund_factor;
	curr_refund_amount = refund_factor * ticket_cost * number_of_passengers;

	-- adding the refund_amount to the tickets table
	UPDATE tickets
	SET refund_amount = refund_amount + curr_refund_amount
	WHERE pnr_number=berth_details.pnr_number
	returning refund_amount
	into new_refund_amount;

	-- berth_details.coach_number will either have A% type or S% type
	-- update tickets count in train_instance
	if berth_details.coach_number LIKE 'A%' then
		execute format('UPDATE train_instance
			SET available_ac_tickets=available_ac_tickets+ %L
			WHERE train_number=%L
			AND journey_date=%L', 
			number_of_passengers,
			ticket_details.train_number, ticket_details.journey_date);
	else
		execute format('UPDATE train_instance
			SET available_sleeper_tickets=available_sleeper_tickets + %L
			WHERE train_number=%L
			AND journey_date=%L', 
			number_of_passengers,
			ticket_details.train_number, ticket_details.journey_date);
	end if;
end
$$;
