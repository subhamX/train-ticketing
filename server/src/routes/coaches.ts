import { Router } from 'express'
import db from '../db/index'

const app = Router()

/**
 * Route to return the list of coaches in the system
 */
app.get('/list/', async (req, res) => {
    try {
        let data = await db.query(`SELECT * FROM coaches`)
        res.send({
            error: false,
            data: data.rows,
            count: data.rowCount,
        })
    } catch (err) {
        res.send({
            error: true,
            message: err.message,
        })
    }
})

/**
 * Route to return the information of the coach
 */
app.get('/info/:coach_id', async (req, res) => {
    try {
        let coach_id = req.params.coach_id
        let data = await db.query(
            `SELECT * FROM coaches WHERE coach_id=$1`,
            [coach_id]
        )
        if (data.rowCount === 0) {
            res.send({
                error: true,
                message: `Invalid coach id ${coach_id}`,
            })
        }
        let composition_table=data.rows[0].composition_table;
        let coach_composition = await db.query(`SELECT * FROM ${composition_table}`);
        res.send({
            error: false,
            data: {
                meta: data.rows[0],
                coach_composition: coach_composition.rows
            },
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

export default app
