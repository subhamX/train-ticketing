import { Router } from 'express'
import db from '../db';

const app = Router();


app.get('/all', async (req, res) => {
    let resp = await db.query('SELECT source as city FROM trains UNION SELECT destination FROM trains')
    let data:any = [];
    resp.rows.forEach(e => {
        data.push(e.city);
    })
    res.json({
        error: false,
        cities: data,
    })
})

export default app
