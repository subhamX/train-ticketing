import Express, { Request, Response } from 'express';
import cookie_parser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import trainRoutes from './routes/trains';
import authRoutes from './auth/index';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import coachesRoute from './routes/coaches';
import citiesRoutes from './routes/cities';
import ticketRoutes from './routes/tickets';
import passport from 'passport';
import cors from 'cors';
import { pool } from './db';

const app = Express()

app.set('trust proxy', 1);

// Configuring connect pg for persistent sessions
const pgSession = require('connect-pg-simple')(session);
app.use(
    cors({
        origin: process.env.CLIENT_URL as string,
        credentials: true,
    })
);
// configuring express session
app.use(
    session({
        store: new pgSession({
            pool: pool,
            tableName: 'session'
        }),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        cookie: process.env.NODE_ENV === 'production' ? { secure: true, sameSite: 'strict' } : {},
    })
);

// Configuring cookie and json parser middleware
app.use(cookie_parser())
app.use(bodyParser.json())

// Configuring passport middleware for authentication
require("./auth/passportConfig")(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use('/tickets/', ticketRoutes)
app.use('/trains/', trainRoutes);
app.use('/auth/', authRoutes);
app.use('/coaches/', coachesRoute);
app.use('/users/', userRoutes);
app.use('/admin/', adminRoutes);
app.use('/cities/', citiesRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send({
        'status': 200,
        'error': false
    })
})

/**
 * Not Found Handler 
 */
app.get('*', function (req, res) {
    res.status(404).send({
        error: true,
        message: `Cannot ${req.method} ${req.path}`
    });
});

app.listen(process.env.PORT ?? 8080, () => {
    console.log(`Server running at PORT:${process.env.PORT ?? 8080}`)
})
