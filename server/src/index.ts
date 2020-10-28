import Express, { Request, Response } from 'express'
import cookie_parser from 'cookie-parser'
import bodyParser from 'body-parser'

import trainRoutes from './routes/trains'
import authRoutes from './auth/index'
import userRoutes from './routes/user'
import ticketRoutes from './routes/tickets';

const app = Express()
app.use(cookie_parser())
app.use(bodyParser.json())

app.use('/tickets/', ticketRoutes)
app.use('/trains/', trainRoutes);
app.use('/auth/', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
})


app.get('*', function (req, res) {
    res.status(404).send({
        error: true,
        message: `Cannot ${req.method} ${req.path}`
    });
});

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running at PORT:${process.env.PORT ?? 3000}`)
})
