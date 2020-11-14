import { Router } from 'express'
import db from '../db/index'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'
import passport from 'passport'
import { UserSchema } from '../schema/model'
import { IVerifyOptions } from "passport-local";
import { verifyAdmin, verifyToken } from './helper'


dotenv.config()
const app = Router()

app.get('/status', verifyToken, (req, res) => {
    let { password, current_token, ...userData } = req.user as UserSchema;
    res.json({
        user: userData,
        message: 'Successfully logged into private route',
    })
})

// register a new user
app.post('/register/', async (req, res, next) => {
    try {
        const instance = await db.query(
            `SELECT * from users WHERE username = $1 OR email = $2`,
            [req.body.username, req.body.email]
        )
        if (instance.rowCount !== 0) {
            throw Error('User Name or Email already exists')
        }
        // user doesn't exist
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //   insert the user into Users table in database
        let data = await db.query(
            `INSERT INTO users(username, email, first_name, last_name, is_admin, password) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                req.body.username,
                req.body.email,
                req.body.first_name,
                req.body.last_name,
                false,
                hashedPassword,
            ]
        )
        let { password, current_token, ...userData } = data.rows[0] as UserSchema;

        req.logIn(userData, (err) => {
            if (err) { return next(err); }
            res.send({
                error: false,
                user: userData,
                message: `User ${req.body.username} successfully registered`,
            })
        })


    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

// ## Login
app.post('/login/', async (req, res, next) => {
    try {
        passport.authenticate("local", (err: Error, user: UserSchema, info: IVerifyOptions) => {
            if (err) { return next(err); }
            if (!user) {
                res.send({ "error": true, message: info.message });
            }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                let { password, current_token, ...user } = req.user as UserSchema;
                res.send({ "error": false, message: "Success! You are logged in.", user });
            });
        })(req, res, next);
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

// ## logout
app.post('/logout', verifyToken, async (req, res) => {
    try {
        req.logout();
        req.session.destroy(function (err) {
            res.send({ error: false, message: 'Logged out successfully!' })
        });
    } catch (err) {
        res.send({
            error: true,
            message: err.message,
        })
    }
})

export default app
