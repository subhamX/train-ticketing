import { Router } from 'express'
import { UserSchema } from 'src/schema/model';
import { verifyToken } from '../auth/helper'

const app = Router();


app.get('/profile', verifyToken, (req, res) => {
    let {password, current_token, ...user} = req.user as UserSchema;
    res.json({
        error: false,
        user,
    })
})

export default app
