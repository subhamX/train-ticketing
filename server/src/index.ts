import Express, { Request, Response } from 'express';
import cookie_parser from 'cookie-parser';
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
import path from 'path';

const app = Express()

app.set('trust proxy', 1);

// middleware function to force HTTPS
app.use((req:Request, res:Response, next:any) =>{
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});
// Configuring connect pg for persistent sessions
const pgSession = require('connect-pg-simple')(session);
app.use(
    cors({
        origin: process.env.CLIENT_URL as string ?? '/',
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
        secret: (process.env.SESSION_SECRET as string),
        resave: false,
        cookie: process.env.NODE_ENV === 'production' ? { secure: true, sameSite: 'strict' } : {},
    })
);
app.use(Express.static(path.join(__dirname, 'build')));
// Configuring cookie and json parser middleware
app.use(cookie_parser())
app.use(Express.json())

// Configuring passport middleware for authentication
require("./auth/passportConfig")(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/tickets/', ticketRoutes)
app.use('/api/trains/', trainRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/coaches/', coachesRoute);
app.use('/api/users/', userRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/cities/', citiesRoutes);


app.get('/api/', (req: Request, res: Response) => {
    res.send({
        'status': 200,
        'error': false
    })
})

/**
 * Not Found Handler 
 */
app.get('/api/*', function (req, res) {
    res.status(404).send({
        error: true,
        message: `Cannot ${req.method} ${req.path}`
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/build/index.html'));
})

app.listen(process.env.PORT ?? 8080, () => {
    console.log(`Server running at PORT:${process.env.PORT ?? 8080}`)
})
