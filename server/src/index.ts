import Express from 'express';
import trainRoutes from './routes/trains';

const app = Express();

app.use('/trains/', trainRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
})


app.listen(process.env.PORT??3000, () => {
    console.log(`Server running at PORT:${process.env.PORT??3000}`)
})
