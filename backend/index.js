import express from "express";
import { PORT, mongoURL } from "./config.js";
import userRoute from './routes/userRoute.js';
import accountRoute from './routes/accountRoute.js';
import historyRoute from './routes/historyRoute.js';
import investmentRoute from './routes/investmentRoute.js';
import cors from 'cors'
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (request,response) => {
    return response.status(234).send("Welcome to transfer Module");
});

app.use('/user',userRoute);
app.use('/account',accountRoute);
app.use('/history',historyRoute);
app.use('/investment',investmentRoute);
mongoose
    .connect(mongoURL)
    .then(() => {
        console.log("DB connection is done!")
        app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`);
        });
        
    })
    .catch((error) => {
        console.log(error)
    })