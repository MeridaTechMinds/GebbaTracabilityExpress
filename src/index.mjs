import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from "mongoose"
import { indexRouter } from "./Router/indexRouter.mjs"
import { getCurrentDate, loggging } from "./Utils/middlewares.mjs"


const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(express.static('static'))
const port = process.env.Port || 8002


mongoose.connect(`mongodb://localhost:27017/${process.env.Database}`).then((response) => {
    console.log("Connected with the Database");
}).catch((error) => {
    console.log(error);
})

app.use(express.urlencoded({ extended: true }));
app.use(loggging)
app.use('/api', indexRouter)

app.get('/', (req, res) => {
    return res.send('Welcome to the server!');
});

app.listen(port, () => {
    console.log(`Server running on the port : ${port} `);

})
