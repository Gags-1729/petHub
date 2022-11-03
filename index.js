const express=require('express');
const createError = require('http-errors');
const app=express();
require('dotenv').config();
const userRoute = require('./routes/user')
const petRoute = require('./routes/pet')
const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017'

mongoose.connect(url, {useNewUrlParser: true}, ()=> {
    console.log("connection established at "+url);
})

const db = mongoose.connection;
db.on('error', err => {
    console.error('connection error: '+err);
})

const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome to PetHub")
})


app.use('/api/user', userRoute);

app.use('api/pet', petRoute);


app.use((req, res, next)=>{
    next(createError(404, 'Not Found Route'))
})

app.use((err, req, res, next) =>{
    res.status(err.status || 500);
    res.send({
            status: err.status || 500,
            message: err.message
    })
})

app.listen(port, ()=>{
    console.log('Server running at port '+port)
})