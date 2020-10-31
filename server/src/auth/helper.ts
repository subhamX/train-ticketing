import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { Request, Response } from 'express'
import db from '../db/index'
import { UserSchema } from 'src/schema/model'
dotenv.config()

interface jwtpayload {
    username: string
    issuer: string
}

// generates new auth and refresh token and sets the cookie header
export const setTokenIntoCookies = async (username: string, res: Response) => {
    let { token, refreshtoken } = await generateToken(username)
    let options = { secure: false, httpOnly: true }
    res.cookie('auth_token', token, options)
    res.cookie('refresh_token', refreshtoken, options)
}

// generated new auth and refresh token & updates the database
export const generateToken = async (username: string) => {
    console.log('New token generated')
    const payload = {
        username: username,
        issuer: 'IITRPR-CS301',
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
        algorithm: 'HS256',
        expiresIn: '1m',
    })
    const refreshtoken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as jwt.Secret,
        {
            algorithm: 'HS256',
        }
    )
    await db.query(`UPDATE users SET current_token = $1 WHERE username = $2`, [
        refreshtoken,
        username,
    ])

    return { token, refreshtoken }
}

// middleware to verify the auth status
export const verifyToken = async (req: Request, res: Response, next: any) => {
    const token = req.cookies.auth_token
    if (!token) {
        return res.send({
            error: true,
            message: 'Access Denied! No token found',
        })
    }

    try {
        const verifiedData: any = jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret
        )
        res.locals.username = verifiedData['username']
        return next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.send({
                error: true,
                message: 'Invalid JSONWebToken',
            })
        } else if (err.name === 'TokenExpiredError') {
            try {
                const refresh_token = req.cookies.refresh_token
                let instance: jwtpayload = jwt.verify(
                    refresh_token,
                    process.env.JWT_REFRESH_SECRET as jwt.Secret
                ) as jwtpayload
                let username = instance['username']
                let queryResponse = await db.query(
                    'SELECT current_token FROM users where username=$1',
                    [username]
                )
                if (queryResponse.rowCount === 0) {
                    throw Error('Invalid User')
                }
                let userInstance = queryResponse.rows[0] as UserSchema
                if (userInstance.current_token !== refresh_token) {
                    throw Error('Invalid Refresh Token')
                }
                await setTokenIntoCookies(username, res)
                res.locals.username = username
                next()
            } catch (err) {
                return res.send({
                    error: true,
                    message: err.message,
                })
            }
        } else {
            return res.send({
                error: true,
                message: err.message,
            })
        }
    }
}


export const verifyAdmin = async (req: Request, res: Response, next: any) => {
    try{
        let response = await db.query('SELECT is_admin FROM users where username=$1', [res.locals.username]);
        if(response.rowCount===0 || response.rows[0]['is_admin']==false){
            return res.send({
                error: true,
                message: 'Access Denied. Please authenticate with admin credentials.'
            })
        }else{
            return next();
        }
    }catch(err){
        return res.send({
            error: true,
            message: err.message,
        })
    }
}