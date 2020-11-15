import { Router } from 'express';
import { trainInstanceSchema, trainSchema } from '../schema/validators';
import { verifyAdmin, verifyToken } from '../auth/helper';
import db from '../db/index';

const app = Router();

// Route for admins to add a new train
app.post('/trains/add/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        let result = trainSchema.validate(req.body);
        if (result.error === undefined) {
            let { train_number, train_name, source, destination, source_departure_time, journey_duration, sleeper_ticket_fare, ac_ticket_fare } = req.body;
            await db.query(`INSERT INTO trains(train_number, train_name, source, destination, source_departure_time, journey_duration, sleeper_ticket_fare, ac_ticket_fare )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, [train_number, train_name, source, destination, source_departure_time, journey_duration, sleeper_ticket_fare, ac_ticket_fare]);

            res.send({
                error: false,
                message: `Train ${train_name} with ${train_number} inserted successfully`
            })
        } else {
            throw Error(`ValidationError: ${result.error?.details[0].message}`);
        }
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

/**
 * 
 * Function to expand the given rowCount and columnCount
 * expand(3, 2) returns "($1, $2), ($3, $4), ($5, $6)" 
 */
function expand(rowCount: number, columnCount: number, startAt = 1) {
    var index = startAt
    return Array(rowCount).fill(0).map(v => `(${Array(columnCount).fill(0).map(v => `$${index++}`).join(", ")})`).join(", ")
}

/**
 * Function to flatten the 2-D array
 * flatten([[1, 2], [3, 4]]) returns [1, 2, 3, 4]
 */
function flatten(arr: any[][]) {
    var newArr: any = []
    arr.forEach((v: any) => v.forEach((p: any) => newArr.push(p)))
    return newArr
}

app.post('/coaches/add/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        let { name, description, composition } = req.body;
        // TODO: Add validation
        let coach = await db.query(`INSERT INTO coaches(name, description)
            VALUES($1, $2)
            RETURNING *`, [name, description]);

        let compositionTableName = coach.rows[0]['composition_table'];
        let seats = composition.length;
        let payload = [];
        for (let i = 0; i < seats; i++) {
            let berth_number = composition[i]['berth_number'];
            let berth_type = composition[i]['berth_type'];
            payload.push([berth_number, berth_type]);
        }
        // performing batch insert
        await db.query(`INSERT INTO ${compositionTableName}(berth_number, berth_type) VALUES ${expand(payload.length, 2)}`, flatten(payload))

        res.send({
            error: false,
            message: coach.rows[0]
        })

    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

interface TrainInstanceSchema {
    train_number: String;
    journey_date: Date;
    booking_start_time: Date;
    booking_end_time: Date;
    number_of_ac_coaches: Number;
    number_of_sleeper_coaches: Number;
    ac_coach_id: Number;
    sleeper_coach_id: Number;
}

app.post('/addbookinginstance/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        let instance: TrainInstanceSchema = req.body;
        instance.booking_end_time = new Date(instance.booking_end_time);
        instance.booking_start_time = new Date(instance.booking_start_time);
        instance.journey_date = new Date(instance.journey_date);

        let result = trainInstanceSchema.validate(instance);
        if (result.error !== undefined) {
            throw Error("ValidationError: " + result.error?.details[0].message);
        }
        let response = await db.query(`insert into train_instance(
            train_number, 
            journey_date, 
            booking_start_time, 
            booking_end_time, 
            number_of_ac_coaches, 
            number_of_sleeper_coaches, 
            ac_coach_id, 
            sleeper_coach_id
        )
        values($1, $2, $3, $4, $5, $6, $7, $8)`, [
            instance.train_number,
            instance.journey_date, instance.booking_start_time,
            instance.booking_end_time, instance.number_of_ac_coaches,
            instance.number_of_sleeper_coaches,
            instance.ac_coach_id, instance.sleeper_coach_id,
        ]);

        let responseMsg;
        if (response.rowCount) {
            responseMsg = `Booking instance with Train Number ${instance.train_number} and Journey Date ${instance.journey_date.toDateString()} was successfully inserted`;
        } else {
            responseMsg = `Something went wrong while adding a booking instance with Train Number ${instance.train_number} and Journey Date ${instance.journey_date.toDateString()}`;
        }
        res.send({
            error: false,
            message: responseMsg
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})


export default app;