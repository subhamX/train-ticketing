import { Router } from 'express'
import db from '../db/index'

const app = Router()

// returns a comprehensive list of registered trains in the system
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
        let resp = await db.query(`select booking_end_time, booking_start_time, journey_date, 
            CASE WHEN booking_end_time > $2 and booking_start_time < $2 then 'active' 
            WHEN booking_start_time > $2 then 'inactive'
            ELSE 'expired'
            END as status
            from train_instance
            where train_number=$1`, [train_number, new Date()]
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
        let data = await db.query(
            `SELECT train_number, journey_date, booking_start_time, booking_end_time,
             sleeper_ticket_fare, ac_ticket_fare
             FROM train_instance WHERE booking_end_time > $1 AND booking_start_time <= $1`,
            [new Date()]
        )
        if (data.rowCount === 0) {
            return res.send({
                error: true,
                message: `No trains available for booking`,
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

export default app
