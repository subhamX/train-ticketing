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

        let compositionTableName=coach.rows[0]['composition_table'];
        let seats=composition.length;
        for(let i=0;i<seats;i++){
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

export default app;