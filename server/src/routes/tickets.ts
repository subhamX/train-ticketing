import { Router } from 'express'
import { verifyToken } from '../auth/helper'
import db from '../db/index'

const app = Router();

const PREFIX = 'train';

interface Passenger {
    passenger_age: Number;
    passenger_name: String;
    passenger_gender: String;
    seat_number: Number;
    coach_id: String;
    seat_preference: String;
}

// helper function to build the train_table_name
function getTrainTableName(train_number: Number, journey_date: Date) {
    let date = journey_date.getDate(), month = journey_date.getMonth() + 1, year = journey_date.getFullYear();
    return `${PREFIX}_${train_number}_${date}${month}${year}`;
}

function generatePassengerString(passengers: Passenger[]) {
    let finalString: String = '';
    passengers.forEach((passenger, index) => {
        // ensure the ordering of variable is same as the ordering defined while declaring the type
        let passengerString = `('${passenger.passenger_name}',
            ${passenger.passenger_age},
            '${passenger.passenger_gender}'`;

        if (passenger.seat_number) {
            passengerString += `,'${passenger.seat_number}'`;
        } else {
            passengerString += `,NULL`;
        }
        if (passenger.coach_id) {
            passengerString += `,'${passenger.coach_id}'`;
        } else {
            passengerString += `,NULL`;
        }
        if (passenger.seat_preference) {
            passengerString += `,'${passenger.seat_preference}'`;
        } else {
            passengerString += `,NULL`;
        }
        passengerString += `)::passenger`;

        finalString += passengerString
        if (index !== passengers.length - 1) {
            finalString += ', ';
        }
    })

    return finalString;
}


// route to book ticket
app.post('/book', verifyToken, async (req, res) => {
    try {
        let { ticket_fare, train_number, transaction_number, type } = req.body;
        let passengers: Passenger[] = req.body.passengers;
        let journey_date_milliseconds = Date.parse(req.body.journey_date);

        let username = res.locals.username;
        let journey_date = new Date(journey_date_milliseconds);
        // TODO: validate all including all passengers

        let method = 0;
        let passengerPayload = generatePassengerString(passengers);
        let response = await db.query(`call book_tickets(passengers=>array[${passengerPayload}],
            train_number=>$1,
            journey_date=>$2,
            username=>$3,
            transaction_number=>$4,
            ticket_fare=>$5,
            method=>$6,
            type=>$7
        )`,
            [train_number, journey_date, username, transaction_number, ticket_fare, method, type]);
        res.send({
            error: false,
            response: response.rows,
        })

    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

export default app;
