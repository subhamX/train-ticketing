import { Router } from 'express'
import { bookTicketInstanceSchema, cancelTicketSchema } from '../schema/validators';
import { verifyToken } from '../auth/helper'
import db from '../db/index'
import { UserSchema, Passenger, TicketInstance, transactionVerdict } from 'src/schema/model';
import Joi from 'joi';

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
    let resp = await db.query(`SELECT ${attribute} FROM trains WHERE train_number=$1`,
        [trainNumber]);

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


/**
 * Route to allow booking of the ticket by an authenticated user 
 */
app.post('/book/', verifyToken, async (req, res) => {
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

        let response = await db.serializedTransaction(`call book_tickets(passengers=>array[${passengerPayload}],
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

        let resp = await db.query(`SELECT cancel_berths(
            pnr_num=>$1, 
            seats=>${seat_numbers}, 
            coach_numbers=>${coach_numbers},
            user_name=>$2)`, [pnrNumber, (req.user as UserSchema).username])

        res.send({
            error: false,
            message: 'Berth Cancellation Successful',
            new_refund_amount: resp.rows[0]['cancel_berths'].split(',')[2].replace(')', '')
        })

    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})


/**
 * 
 * Route to get details of the ticket by the authenticated booking agent
 * 
 */
app.get('/info/:id', verifyToken, async (req, res) => {
    try {
        let pnrNumber = req.params.id;
        Joi.assert(pnrNumber, Joi.string().alphanum().required())
        pnrNumber = pnrNumber.toLowerCase();
        let resp = await db.query(`select ac_coach_id,sleeper_coach_id, pnr_number, tickets.train_number, tickets.journey_date, train_table_name, trains.source_departure_time, trains.journey_duration
            from trains, train_instance, tickets
            where trains.train_number=train_instance.train_number
            and trains.train_number=tickets.train_number
            and tickets.journey_date=train_instance.journey_date
            and pnr_number=$1
            and username=$2`,
            [pnrNumber, (req.user as UserSchema).username]
        );
        if (resp.rowCount === 0) {
            throw Error("Invalid PNR Number or not authorized to see the details");
        }
        let meta = {
            pnr_number: pnrNumber,
            train_number: resp.rows[0].train_number,
            journey_date: new Date(resp.rows[0].journey_date).toDateString(),
            destination_arrival_time: resp.rows[0].destination_arrival_time,
            source_departure_time: resp.rows[0].source_departure_time,
        }
        let trainTableName = resp.rows[0].train_table_name;

        // ticket will either have ac coaches or sleeper one
        // check if the one is AC or Sleeper
        let temp = await db.query(`select coach_number
            from ${trainTableName}
            where pnr_number=$1
            limit 1;`,
            [pnrNumber]
        )
        let berthsResp;
        if (temp.rowCount === 0) {
            // all tickets are cancelled
            berthsResp = await db.query(`select *, 1 as is_cancelled, 'X' as seat_type
            from cancelled_berths
            where pnr_number=$1`,
                [pnrNumber]
            );
        } else {
            let coachID;
            if (temp.rows[0]['coach_number'][0] === 'A') {
                coachID = resp.rows[0]['ac_coach_id'];
            } else {
                coachID = resp.rows[0]['sleeper_coach_id'];
            }
            let coachCompositionTableName=`coach_composition_${coachID}`

            berthsResp = await db.query(`select *, 1 as is_cancelled, 'X' as seat_type
                from cancelled_berths
                where pnr_number=$1
                union
                select A.*, NULL as cancellation_timestamp, 0 as is_cancelled, berth_type as seat_type
                from ${trainTableName} as A, ${coachCompositionTableName} as B
                where pnr_number=$1
                and A.seat_number= B.berth_number;`,
                [pnrNumber]
            )
        }

        res.send({
            error: false,
            meta,
            berths: berthsResp.rows,
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

/**
 * Route to get all tickets associated with a verified user
 */
app.get('/all/', verifyToken, async (req, res) => {
    try {
        let username = (req.user as UserSchema).username;
        let resp = await db.query(`select journey_duration, refund_amount, source_departure_time, destination, source, train_name, time_of_booking, transaction_number, journey_date, tickets.train_number, ticket_fare, pnr_number
        from tickets, trains
        where tickets.train_number=trains.train_number
        and username=$1
        order by time_of_booking desc;`,
            [username]
        );

        res.send({
            error: false,
            username,
            tickets: resp.rows,
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

export default app;
