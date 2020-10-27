import Express from 'express';
import db from './db/index';

const app = Express();


app.get('/', (req, res) => {
    res.send('Hello World');
})


app.listen(process.env.PORT??3000, () => {
    console.log(`Server running at PORT:${process.env.PORT??3000}`)
})
