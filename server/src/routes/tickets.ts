import { Router } from 'express'
import { bookTicketInstanceSchema } from '../schema/validators';
import { verifyToken } from '../auth/helper'
import db from '../db/index'

const app = Router();


interface Passenger {
    passenger_age: Number;
    passenger_name: String;
    passenger_gender: String;
    seat_number: Number;
    coach_id: String;
    seat_preference: String;
}

interface TicketInstance {
    ticket_fare: Number;
    journey_date: Date;
    train_number: String;
    transaction_number: String;
    type: String;
    passengers: Passenger[];
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
        let instance: TicketInstance = req.body;
        let username = res.locals.username;

        let result = bookTicketInstanceSchema.validate(instance);
        if (result.error !== undefined) {
            throw Error(result.error?.details[0].message);
        }

        instance.type = instance.type.toUpperCase();
        if (instance.type === 'SLEEPER') {
            instance.type = 'S';
        } else if (instance.type === 'AC') {
            instance.type = 'A';
        }

        if (instance.type !== 'A' && instance.type !== 'S') {
            throw Error(`Invalid Coach Type: ${instance.type}`);
        }

        let method = 0;
        let passengerPayload = generatePassengerString(instance.passengers);
        let response = await db.query(`call book_tickets(passengers=>array[${passengerPayload}],
            train_number=>$1,
            journey_date=>$2,
            username=>$3,
            transaction_number=>$4,
            ticket_fare=>$5,
            method=>$6,
            type=>$7
        )`,
            [instance.train_number, instance.journey_date, username, instance.transaction_number, instance.ticket_fare, method, instance.type]);
        res.send({
            error: false,
            response: response.rows,
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

export default app;
