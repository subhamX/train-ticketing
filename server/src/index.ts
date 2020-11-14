import Express, { Request, Response } from 'express';
import cookie_parser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import trainRoutes from './routes/trains';
import authRoutes from './auth/index';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import coachesRoute from './routes/coaches';


import ticketRoutes from './routes/tickets';
import passport from 'passport';
import cors from 'cors';
const app = Express()

app.use(
    cors({
        origin: process.env.CLIENT_URL as string,
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(cookie_parser())
app.use(bodyParser.json())
require("./auth/passportConfig")(passport);

app.use(passport.initialize());
app.use(passport.session());


app.use('/tickets/', ticketRoutes)
app.use('/trains/', trainRoutes);
app.use('/auth/', authRoutes);
app.use('/coaches/', coachesRoute);
app.use('/users/', userRoutes);
app.use('/admin/', adminRoutes);

app.get('/', (req: Request, res: Response) => {

    res.send({
        'status': 200,
        'error': false
    })
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
