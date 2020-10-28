import Express, { Request, Response } from 'express'
import trainRoutes from './routes/trains'
import authRoutes from './auth/index'
import userRoutes from './routes/user'
import cookie_parser from 'cookie-parser'

const app = Express()
app.use(cookie_parser())

app.use('/trains/', trainRoutes)
app.use('/auth/', authRoutes)
app.use('/user', userRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
})

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running at PORT:${process.env.PORT ?? 3000}`)
})
