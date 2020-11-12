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

/**
 * middleware to verify the auth status
 */
export const verifyToken = async (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.send({
        error: true,
        message: 'Access Denied! No token found',
    })
}

/**
 * middleware to verify the admin status
 */
export const verifyAdmin = async (req: Request, res: Response, next: any) => {
    try {
        if (req.isUnauthenticated()) {
            return res.send({
                error: true,
                message: 'Access Denied! No token found',
            })
        }
        if ((req.user as UserSchema)['is_admin'] === false) {
            return res.send({
                error: true,
                message: 'Access Denied. Please authenticate with admin credentials.'
            })
        } else {
            return next();
        }
    } catch (err) {
        return res.send({
            error: true,
            message: err.message,
        })
    }
}