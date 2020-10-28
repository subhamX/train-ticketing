master
import { Router } from "express";
import bodyParser from "body-parser";
import db from "../db/index";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import { setTokenIntoCookies, verifyToken } from "./helper";

dotenv.config()
const app = Router()
app.use(bodyParser.json())

app.get('/status', verifyToken, (req, res) => {
    res.json({
        user: res.locals.username,
        message: 'Successfully logged into private route',
    })
})

// register a new user
app.post('/register/', async (req, res) => {
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
        await db.query(
            `INSERT INTO users(username, email, first_name, last_name, is_admin, password) VALUES($1, $2, $3, $4, $5, $6)`,
            [
                req.body.username,
                req.body.email,
                req.body.first_name,
                req.body.last_name,
                false,
                hashedPassword,
            ]
        )
        await setTokenIntoCookies(req.body.username, res)
        res.send({
            error: true,
            message: `User ${req.body.username} successfully registered`,
        })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

// ## Login
app.post('/login/', async (req, res) => {
    try {
        const instance = await db.query(
            `SELECT * FROM users WHERE username = $1`,
            [req.body.username]
        )
        if (instance.rowCount === 0) {
            res.send({ error: true, message: "username doesn't exist" })
        }

        const isPassSame = await bcrypt.compare(
            req.body.password,
            instance.rows[0].password
        )
        if (!isPassSame) {
            res.send({ error: true, message: 'Incorrect Password' })
        }

        await setTokenIntoCookies(req.body.username, res)

        res.send({ error: false, message: 'LoggedIn successfully!' })
    } catch (err) {
        res.send({ error: true, message: err.message })
    }
})

// ## logout
app.post("/logout", async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    res.send({
      error: true,
      message: "No Access Token found!",
    });
  }
  try {
    await db.query(
      `UPDATE users SET current_token = NULL WHERE current_token = $1`,
      [token]
    );
    res.send({ success: "Logged out successfully!" });
  } catch (err) {
    res.send({
      error: true,
      message: err.message,
    });
  }
});

export default app
