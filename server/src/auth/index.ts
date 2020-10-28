import { Router } from "express";
import bodyParser from "body-parser";
import db from "../db/index";
import * as dotenv from "dotenv";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = Router();
app.use(bodyParser.json());


// Register
app.post('/register', async (req, res) => {
  try {
    const checkUser = await db.query(
      `SELECT * from users WHERE user_name = $1 OR email = $2`,
      [req.body.user_name, req.body.email]
    );
    if (checkUser.rowCount == 0) {
      const hashedPswd = await bcrypt.hash(req.body.password, 10);
      //   insert the user/admmin info into Users table in database
      await db.query(
        `INSERT INTO users(user_name, email, first_name, last_name, admin, password) VALUES($1, $2, $3, $4, $5, $6)`,
        [
          req.body.user_name,
          req.body.email,
          req.body.first_name,
          req.body.last_name,
          req.body.admin,
          hashedPswd,
        ]
      );
      console.log("registered successfully!");
      res.redirect("/login");
    } else {
      res.send({ error: "User Name or Email already exists." });
    }
  } catch (err) {
    console.log("error", err.message);
    res.redirect("/register");
  }
});



// ## Login 
app.post('/login/', async (req, res) => {
  try {
    const checkUser = await db.query(
      `SELECT * FROM users WHERE user_name = $1 AND admin = $2`,
      [req.body.user_name, req.body.admin]
    );
    // console.log(checkUser.rowCount, req.body.user_name);
    if (checkUser.rowCount != 0) {
      const isPassSame = await bcrypt.compare(
        req.body.password,
        checkUser.rows[0].password
      );
      if (isPassSame) {
        console.log("password matched");
        const payload = {
          user_name: checkUser.rows[0].user_name,
          admin: checkUser.rows[0].admin,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "15m",
        });
        const refreshtoken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
          algorithm: "HS256",
        });

        // update refresh token in users table in database
        await db.query(
          `UPDATE users SET current_token = $1 WHERE user_name = $2 AND admin = $3`,
          [refreshtoken, req.body.user_name, req.body.admin]
        );

        res
          .cookie("auth_token", token, {secure: true, httpOnly: true})
          .send({ success: "LoggedIn successfully!" });
      } else {
        res.send({msg: "Incorrect Password!"});
      }
    } else {
      res.send({msg: "Incorrect UserName"});
    }
  } catch (err) {
    res.send({ error: true, "err message": err.message });
  }
});


export default app;
