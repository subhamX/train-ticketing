import { Router } from 'express'
import { verifyToken } from '../auth/helper'
import db from '../db/index'

const app = Router();

const PREFIX = 'train';

interface Passenger {
    passenger_age: Number;
    passenger_name: String;
    passenger_gender: String;
}

// helper function to build the train_table_name
function getTrainTableName(train_number: Number, journey_date: Date) {
    let date = journey_date.getDate(), month = journey_date.getMonth() + 1, year = journey_date.getFullYear();
    return `${PREFIX}_${train_number}_${date}${month}${year}`;
}

// route to book ticket
app.post('/book', verifyToken, async (req, res) => {
    try {
        let { ticket_fare, train_number, transaction_number, type } = req.body;
        let passengers: Passenger[] = req.body.passengers;
        let journey_date_milliseconds = Date.parse(req.body.journey_date);
        if (isNaN(journey_date_milliseconds)) {
            throw Error(`Invalid Journey Date ${req.body.journey_date}`)
        }
        let username = res.locals.username;
        let journey_date=new Date(journey_date_milliseconds);
        let time_of_booking = new Date();
        // TODO: validate all including all passengers

        // checking if the train & jouney date has an instance in train_instance and current time is ok for booking
        let trainInstance = await db.query(
            'SELECT * FROM train_instance where train_number=$1 and journey_date=$2',
            [train_number, journey_date]);
        if (trainInstance.rowCount === 0) {
            throw Error(`Invalid attempt to book ticket in ${train_number} train on ${journey_date.toDateString()}`)
        }
        let ticketInstance = await db.query(`INSERT INTO tickets(ticket_fare, train_number, username, transaction_number, time_of_booking)
            VALUES($1, $2, $3, $4, $5)  RETURNING *`, [ticket_fare, train_number, username, transaction_number, time_of_booking]);
        let pnr_number = ticketInstance.rows[0].pnr_number;
        let ticketsReqd = passengers.length;
        let train_table_name = getTrainTableName(train_number, journey_date);

        // fetch available tickets
        let tickets = await db.query(`select seat_number, coach_id
        from ${train_table_name}
        where is_occupied=false
        and coach_id LIKE '${(type === 'AC' ? "A" : "S")}%'
        LIMIT $1;`, [ticketsReqd])
        if (tickets.rowCount < ticketsReqd) {
            throw Error(`Only ${tickets.rowCount} tickets left`)
        }

        // Book tickets
        for (let i = 0; i < ticketsReqd; i++) {
            let { passenger_age, passenger_name, passenger_gender } = passengers[i];
            let { seat_number, coach_id } = tickets.rows[i];
            await db.query(`UPDATE ${train_table_name}
            SET passenger_age=$1,
             passenger_name=$2,
             passenger_gender=$3,
             pnr_number=$6,
             is_occupied=True
            where seat_number=$4
            and coach_id=$5`, [passenger_age, passenger_name, passenger_gender, seat_number, coach_id, pnr_number])
        }

        res.send({
            error: false,
            data: tickets.rows,
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

export default app;
