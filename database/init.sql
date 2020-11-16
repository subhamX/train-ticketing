CREATE TABLE "trains" (
    "train_number" varchar(6)   NOT NULL,
    "train_name" varchar(100)   NOT NULL,
    "source" varchar(100)   NOT NULL,
    "destination" varchar(100)   NOT NULL,
    "source_departure_time" time   NOT NULL,
    "journey_duration" interval   NOT NULL,   
    "sleeper_ticket_fare" decimal NOT NULL,
    "ac_ticket_fare" decimal NOT NULL,     
    CONSTRAINT "pk_trains" PRIMARY KEY (
        "train_number"
     )
);

CREATE TABLE "coaches" (
    "coach_id" serial   NOT NULL,
    "name" varchar(200)   NOT NULL,
    "description" varchar(500)   NOT NULL,
    "composition_table" varchar(300)   NOT NULL,
    "seats_count" int not null,
    CONSTRAINT "pk_coaches" PRIMARY KEY (
        "coach_id"
     )
);

-- *Dynamically created by trigger before coaches row are inserted
-- CREATE TABLE "coach_composition_{coach_id}" (
--     "berth_number" int   NOT NULL,
--     -- if ever we want 3
--     "berth_type" char(3)   NOT NULL,
--     CONSTRAINT "pk_coach_composition_{coach_id}" PRIMARY KEY (
--         "berth_number"
--      )
-- );

CREATE TABLE "train_instance" (
    "train_number" varchar(6)   NOT NULL,
    "journey_date" date   NOT NULL,
    "booking_start_time" timestamptz   NOT NULL,
    "booking_end_time" timestamptz   NOT NULL,
    "number_of_ac_coaches" int  DEFAULT 0 NOT NULL,
    "number_of_sleeper_coaches" int  DEFAULT 0 NOT NULL,
    "ac_coach_id" int   NULL,
    "sleeper_coach_id" int   NULL,
    "train_table_name" varchar(100) NOT NULL,
    "available_ac_tickets" int  NOT NULL,
    "available_sleeper_tickets" int  NOT NULL,
    CONSTRAINT "pk_train_instance" PRIMARY KEY (
        "train_number","journey_date"
     )
);

-- *Dynamically created before row is added to train_instance
-- CREATE TABLE "train_{TrainNumber_DDMMYY}" (
--     "seat_number" int   NOT NULL,
--     "coach_number" varchar(10)   NOT NULL,
--     "pnr_number" varchar(10)   NULL,
--     "passenger_name" varchar(100)   NULL,
--     "passenger_age" int   NULL,
--     "passenger_gender" char   NULL,
--     CONSTRAINT "pk_train_{TrainNumber_DDMMYY}" PRIMARY KEY (
--         "seat_number","coach_number"
--      )
-- );

CREATE TABLE "tickets" (
    "pnr_number" varchar(10) DEFAULT generate_pnr_number(10, 'tickets', 'pnr_number'),
    "ticket_fare" decimal   NOT NULL,
    "train_number" varchar(6)   NOT NULL,
    "journey_date" date NOT NULL,
    "username" varchar(30)   NOT NULL,
    "transaction_number" varchar(300)   NOT NULL,
    "time_of_booking" timestamptz   NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_tickets" PRIMARY KEY (
        "pnr_number"
     )
);


-- stores all cancelled berths
CREATE TABLE "cancelled_berths" (
    "seat_number" int   NOT NULL,
    "coach_number" varchar(10)   NOT NULL,
    "pnr_number" varchar(10)   NULL,
    "passenger_name" varchar(100)   NULL,
    "passenger_age" int   NULL,
    "passenger_gender" char   NULL,
    "cancellation_timestamp" timestamptz not null DEFAULT now(),
    PRIMARY KEY (
        "seat_number","coach_number"
     )
);

ALTER TABLE "cancelled_berths" ADD CONSTRAINT "fk_cancelled_berths" FOREIGN KEY("pnr_number")
REFERENCES "tickets" ("pnr_number");

CREATE TABLE "users" (
    "username" varchar(30)   NOT NULL,
    "email" varchar(100)   NOT NULL,
    "first_name" varchar(100)   NOT NULL,
    "last_name" varchar(100)   NOT NULL,
    "password" varchar(200)   NOT NULL,
    "is_admin" bool   NOT NULL,
    "current_token" varchar(200)   NULL,
    "create_timestamp" timestamptz   NOT NULL DEFAULT NOW(),
    CONSTRAINT "pk_users" PRIMARY KEY (
        "username"
     ),
    CONSTRAINT "uc_users_email" UNIQUE (
        "email"
    )
);

ALTER TABLE "train_instance" ADD CONSTRAINT "fk_train_instance_train_number" FOREIGN KEY("train_number")
REFERENCES "trains" ("train_number");

ALTER TABLE "train_instance" ADD CONSTRAINT "fk_train_instance_ac_coach_id" FOREIGN KEY("ac_coach_id")
REFERENCES "coaches" ("coach_id");

ALTER TABLE "train_instance" ADD CONSTRAINT "fk_train_instance_sleeper_coach_id" FOREIGN KEY("sleeper_coach_id")
REFERENCES "coaches" ("coach_id");

ALTER TABLE "tickets" ADD CONSTRAINT "fk_tickets_train_number" FOREIGN KEY("train_number")
REFERENCES "trains" ("train_number");

ALTER TABLE "tickets" ADD CONSTRAINT "fk_tickets_username" FOREIGN KEY("username")
REFERENCES "users" ("username");



