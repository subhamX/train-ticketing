import { Router } from 'express'
import { bookTicketInstanceSchema, cancelTicketSchema } from '../schema/validators';
import { verifyToken } from '../auth/helper'
import db from '../db/index'
import { UserSchema, Passenger, TicketInstance, transactionVerdict } from 'src/schema/model';

const app = Router();



/**
 * 
 * Function to parse the passengers information into pl/pgsql format
 * 
 */
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

function beautifyPassengersOutput(passengersRaw: String) {
    let passengers: Passenger[] = [];
    let arr = passengersRaw.replace('{\"', '').replace('\"}', '').split('","')
    arr.forEach(e => {
        let instance = e.replace('(', '').replace(')', '').split(',');
        let passenger: Passenger = {
            passenger_age: parseInt(instance[1]),
            passenger_name: instance[0],
            passenger_gender: instance[2],
            seat_number: parseInt(instance[3]),
            coach_id: instance[4],
            seat_preference: instance[5]
        };
        passengers.push(passenger);
    });
    return passengers;
}


/**
 * 
 * Function to verify the ticket_fare and get the payment status
 */
async function getPaymentStatus(numberOfPassengers: number,
    ticket_type: String,
    ticketFare: number,
    trainNumber: String,
    journeyDate: Date,
    transactionNumber: String
): Promise<transactionVerdict> {
    let attribute = `${ticket_type === 'S' ? 'sleeper' : 'ac'}_ticket_fare`;
    // get ticket fare
    let resp = await db.query(`SELECT ${attribute} FROM train_instance WHERE train_number=$1 and journey_date=$2`,
        [trainNumber, journeyDate]);

    if (resp.rowCount === 0) {
        return { verdict: "INVALID_TRANSACTION", "message": `Invalid train number ${trainNumber} and journey_date ${journeyDate.toDateString()}` };
    }
    let amount: number = resp.rows[0][attribute];

    if (amount * numberOfPassengers > ticketFare) {
        return { verdict: "INVALID_TRANSACTION", "message": "Invalid transaction amount" };
    }

    // check if transaction number is valid and get status
    // faking with some generic checks
    if (transactionNumber.length !== 16) {
        return { verdict: "INVALID_TRANSACTION", "message": "Invalid transaction number" };
    }

    await new Promise((res, rej) => {
        setTimeout(() => {
            res(1);
        }, 2000);
    })
    return { verdict: "SUCCESS" };
}


// route to book ticket
app.post('/book', verifyToken, async (req, res) => {
    let instance: TicketInstance = req.body;
    let username = (req.user as UserSchema).username;

    try {
        instance.journey_date = new Date(instance.journey_date);
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

        // verify payment amount and status
        let resp = await getPaymentStatus(instance.passengers.length,
            instance.type,
            instance.ticket_fare,
            instance.train_number,
            instance.journey_date,
            instance.transaction_number
        );

        if (resp.verdict === 'INVALID_TRANSACTION' || resp.verdict === 'PENDING') {
            // pending transactions will be handled after payment confirmation is recieved to webhook 
            throw Error(resp.message);
        }
    } catch (err) {
        return res.send({ error: true, message: err.message })
    }
    // transaction is valid
    try {
        let method = instance.booking_type;
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
            [
                instance.train_number, instance.journey_date,
                username, instance.transaction_number,
                instance.ticket_fare, method,
                instance.type
            ]);

        let { passengers, ...meta } = response.rows[0];
        meta.type = instance.type
        return res.send({
            error: false,
            response: {
                meta,
                passengers: beautifyPassengersOutput(response.rows[0].passengers)
            },
        })
    } catch (err) {
        // valid transaction couldn't booked because of some problems
        return res.send({ error: true, message: err.message })
    }
})


/**
 * route to cancel a berth in a valid ticket
 */
app.post('/cancel/', verifyToken, async (req, res) => {
    try {
        let pnrNumber = req.body.pnr_number;
        let seats: [{ seat_number: Number, coach_number: String }] = req.body.seats;
        let result = cancelTicketSchema.validate({ pnr_number: pnrNumber, seats });
        if (result.error !== undefined) {
            throw Error("ValidationError: " + result.error?.details[0].message);
        }
        let coach_numbers: string = "", seat_numbers: string = "";
        seats.forEach((e, index) => {
            coach_numbers += `'${String(e.coach_number)}'`
            seat_numbers += String(e.seat_number)
            if (index !== seats.length - 1) {
                coach_numbers += ", ";
                seat_numbers += ", ";
            }
        })
        coach_numbers = `array[${coach_numbers}]`;
        seat_numbers = `array[${seat_numbers}]`;

        await db.query(`SELECT cancel_berths(
            pnr_num=>$1, 
            seats=>${seat_numbers}, 
            coach_numbers=>${coach_numbers},
            user_name=>$2)`, [pnrNumber, (req.user as UserSchema).username])

        res.send({
            error: false,
            message: 'Berth Cancellation Successful'
        })

    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

export default app;
