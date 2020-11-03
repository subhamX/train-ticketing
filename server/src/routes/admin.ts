import { Router } from 'express';
import { trainSchema } from '../schema/validators';
import { verifyAdmin, verifyToken } from '../auth/helper';
import db from '../db/index';

const app = Router();

// Route for admins to add a new train
app.post('/trains/add/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        let result = trainSchema.validate(req.body);
        if (result.error === undefined) {
            let { train_number, train_name, source, destination } = req.body;
            await db.query(`INSERT INTO trains(train_number, train_name, source, destination)
            VALUES($1, $2, $3, $4)`, [train_number, train_name, source, destination]);

            res.send({
                error: false,
                message: `Train ${train_name} with ${train_number} inserted successfully`
            })
        } else {
            throw Error(result.error?.details[0].message);
        }
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

app.post('/coaches/add/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        let { name, description, composition } = req.body;
        // TODO: Add validation
        let coach = await db.query(`INSERT INTO coaches(name, description)
            VALUES($1, $2)
            RETURNING *`, [name, description]);

        let compositionTableName = coach.rows[0]['composition_table'];
        let seats = composition.length;
        for (let i = 0; i < seats; i++) {
            await db.query(`INSERT INTO ${compositionTableName}(berth_number, berth_type)
            VALUES($1, $2)`, [composition[i]['berth_number'], composition[i]['berth_type']]);
        }
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
    source_departure_time: Date;
    destination_arrival_time: Date;
    number_of_ac_coaches: Number;
    number_of_sleeper_coaches: Number;
    ac_coach_id: Number;
    sleeper_coach_id: Number;
}

app.post('/addbookinginstance/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        let instance: TrainInstanceSchema = req.body;

        let response = await db.query(`insert into train_instance(
            train_number, 
            journey_date, 
            booking_start_time, 
            booking_end_time, 
            source_departure_time, 
            destination_arrival_time,
            number_of_ac_coaches, 
            number_of_sleeper_coaches, 
            ac_coach_id, 
            sleeper_coach_id)
        values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [instance.train_number,
        instance.journey_date, instance.booking_start_time,
        instance.booking_end_time, instance.source_departure_time,
        instance.destination_arrival_time, instance.number_of_ac_coaches,
        instance.number_of_sleeper_coaches, instance.ac_coach_id, instance.sleeper_coach_id]);
        
        let responseMsg;
        if(response.rowCount){
            responseMsg=`Booking instance with Train Number ${instance.train_number} and Journey Date ${instance.journey_date} was successfully inserted`;
        }else{
            responseMsg=`Something went wrong while adding a booking instance with Train Number ${instance.train_number} and Journey Date ${instance.journey_date}`;
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