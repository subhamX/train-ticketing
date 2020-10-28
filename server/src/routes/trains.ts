import { Router } from 'express';
import db from '../db/index';

const app = Router();

// returns a comprehensive list of registered trains in the system
app.get('/list/', async (req, res) => {
    try {
        let data = await db.query(`SELECT * FROM trains`);
        res.send({
            "error": false,
            "data": data.rows,
            "count": data.rowCount
        });
    } catch (err) {
        res.send({ "error": true, "message": "Couldn't retieve the trains list" , 'err': err.message});
    }
});

// returns the information of the train
app.get('/info/:train_number', async (req, res) => {
    try {
        let train_number = req.params.train_number;
        let data = await db.query(`SELECT * FROM trains WHERE train_number=$1`, [train_number]);
        if(data.rowCount===0){
            // train with train_number doesn't exist
            res.send({ "error": true, "message": `Invalid train number ${train_number}` });
        }
        res.send({
            "error":false,
            "data": data.rows[0]
        });
    } catch (err) {
        res.send({ "error": true, "message": err.message });
    }
})

export default app;