const express=require('express');
const createError = require('http-errors');
const app=express();
require('dotenv').config();
const userRoute = require('./routes/user')
const petRoute = require('./routes/pet')
const mongoose = require('mongoose')

const url = process.env.DB_CONNECT;

mongoose.connect(url, {useNewUrlParser: true}, ()=> {
    console.log("database connection established at "+url);
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

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready for messages");
      console.log(success);
    }
  });

function sendmail(){
    const mailConfigurations = {
        from: process.env.AUTH_EMAIL,
        to: 'gaggup437@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'Hi! There, You know I am using the NodeJS '
         + 'Code along with NodeMailer to send this email.'
    };
        
    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw Error(error);
           console.log('Email Sent Successfully');
        console.log(info);
    });
}

sendmail();