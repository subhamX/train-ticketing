import { Router } from 'express'
import Joi from 'joi'
import { UserSchema } from 'src/schema/model'
import db from '../db/index'

const app = Router()

/**
 * Route to serve a comprehensive list of registered trains in the system
 */
app.get('/list/', async (req, res) => {
    try {
        let data = await db.query(`SELECT * FROM trains`)
        res.send({
            error: false,
            data: data.rows,
            count: data.rowCount,
        })
    } catch (err) {
        res.send({
            error: true,
            message: "Couldn't retieve the trains list",
            err: err.message,
        })
    }
})

/**
 * Route to return train metadata and all active, inactive and expired booking instances of the trains 
 */
app.get('/info/:train_number', async (req, res) => {
    try {
        let train_number = req.params.train_number
        let data = await db.query(
            `SELECT * FROM trains WHERE train_number=$1`,
            [train_number]
        )
        if (data.rowCount === 0) {
            // train with train_number doesn't exist
            return res.send({
                error: true,
                message: `Invalid train number ${train_number}`,
            })
        }
        // adding the train instance
        let resp = await db.query(`select booking_end_time, booking_start_time, journey_date,
            available_ac_tickets, available_sleeper_tickets,
            CASE WHEN booking_end_time > $2 and booking_start_time < $2 then 'active' 
            WHEN booking_start_time > $2 then 'inactive'
            ELSE 'expired'
            END as status
            from train_instance
            where train_number=$1
            order by journey_date`, [train_number, new Date()]
        );
        return res.send({
            error: false,
            meta: data.rows[0],
            instances: resp.rows
        })
    } catch (err) {
        return res.send({ error: true, message: err.message })
    }
})

/**
 * Route to return all global active booking instances 
 */
app.get('/current/active', async (req, res) => {
    try {
        let { source, destination, date } = req.query;
        let data;
        let queryResult = false;
        if (source && destination && date) {
            queryResult = true;

            data = await db.query(
                `SELECT train_instance.train_number, journey_date, booking_start_time, booking_end_time,
            sleeper_ticket_fare, ac_ticket_fare,
            journey_duration, available_ac_tickets,available_sleeper_tickets,
            source_departure_time, source, destination, train_name
            FROM train_instance, trains WHERE booking_end_time > $1 AND booking_start_time <= $1
            AND source LIKE $2
            AND destination LIKE $3
            AND trains.train_number=train_instance.train_number
            AND journey_date=$4
            order by journey_date`,
                [new Date(), `%${source}%`, `%${destination}%`, date]
            );
        } else {
            data = await db.query(
                `SELECT train_number, journey_date, booking_start_time, booking_end_time,
             available_ac_tickets, available_sleeper_tickets
             FROM train_instance WHERE booking_end_time > $1 AND booking_start_time <= $1`,
                [new Date()]
            );
        }

        if (data.rowCount === 0) {
            let message;
            if (queryResult) {
                message = `No trains available for booking with query Source:${source}, Destination: ${destination}, Date: ${date}`;
            } else {
                message = `No trains available for booking`
            }
            return res.send({
                error: true,
                message,
            })
        }
        return res.send({
            error: false,
            count: data.rowCount,
            data: data.rows,
        })
    } catch (err) {
        return res.send({ error: true, message: err.message })
    }
})

/**
 * Route to serve the reservation chart of a train on a day
 * Expects trainNumber and date to be in query params 
 * Date should be of format DDMMYYYY
 * 
 * If the user is admin then all details including passenger age, gender etc are sent. 
 * Else only non-sensitive details are returned
 */
app.get('/chart/:trainNumber/:dateOfJourney', async (req, res) => {
    try {
        let { trainNumber, dateOfJourney } = req.params;
        Joi.assert(trainNumber, Joi.number());
        Joi.assert(dateOfJourney, Joi.date());
        let trainTableName = `train_${trainNumber}_${dateOfJourney}`
        let attributes;
        if (req.user!==undefined && (req.user as UserSchema).is_admin) {
            attributes='*';
        }else{
            attributes='seat_number, coach_number,passenger_name, pnr_number';
        }
        let resp = await db.query(`SELECT ${attributes} FROM ${trainTableName} WHERE pnr_number IS NOT NULL;`);

        if (resp.rowCount === 0) {
            return res.send({ error: false, message: 'No tickets booked so far' })
        }
        return res.send({ error: false, data: resp.rows })
    } catch (err) {
        return res.send({ error: true, message: err.message })
    }
})
export default app
