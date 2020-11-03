-- * Snippet to drop the complete schema and create a new one 
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

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



create or replace function get_train_name(
	IN train_table_name_PREFIX varchar(100),
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

