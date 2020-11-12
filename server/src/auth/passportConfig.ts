import { PassportStatic } from 'passport';
import passportLocal from 'passport-local';
import db from '../db/index';
import * as bcrypt from 'bcrypt'
const LocalStrategy = passportLocal.Strategy;


module.exports = function (passport: PassportStatic) {
    passport.serializeUser<any, any>((user, done) => {
        if(user){
            done(null, user.username);
        }
    });

    passport.deserializeUser(async (username, done) => {
        try {
            const instance = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            if (instance.rowCount === 0) {
                throw Error("username doesn't exist")
            }
            let user = instance.rows[0]
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    });


    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const instance = await db.query('SELECT * FROM users WHERE username = $1', [username]);

            if (instance.rowCount === 0) {
                throw Error("username doesn't exist")
            }
            let user = instance.rows[0]
            const isPassSame = await bcrypt.compare(
                password,
                user.password
            )
            if (!isPassSame) {
                throw Error('Incorrect Password');
            }
            // successful auth
            done(undefined, user)
        } catch (err) {
            return done(undefined, false, { message: err.message })
        }
    }));
}

