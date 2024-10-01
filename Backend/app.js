require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')


const app = express();
app.use(express.json());
const port = 8080;
app.use(cors());
app.use(express.urlencoded({extended:true}))

// Database Connection
const url = process.env.DB_URL;
main()
    .then(() => {
        console.log("connection succesfull...");

    }).catch(err => console.log(err));

async function main() {
    await mongoose.connect(url);

}

// Routers

const mainRouter = require("./Routes/index");


app.use('/api/v1/',mainRouter);

app.listen(port, () => {
    console.log('Server running on port',port);
});