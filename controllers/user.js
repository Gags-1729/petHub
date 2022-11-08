const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');

const createError = require('http-errors');

exports.user_register = async(req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    console.log(user);

    try {
        await user.save().then((result) => {
            console.log("Registered user");
            res.status(200).send({
                status: 200,
                message: "User registered successfully"
            });
        })
    } catch (err) {
        next(err);
        return;
    }
}

exports.user_find_all = async(req, res, next) => {
    try {
        sendmail();
        const users = await User.find();
        res.send(users);
    } catch(err){
        next(err);
        return;
    }
}

exports.user_find_one = async(req, res, next) => {
    const {id} = req.params;
    try{
        const user = await User.findOne({_id: id });
        if(user) {
            res.status(200).send(user);
        } else {
            throw createError(404, 'Not Found');
        }
    } catch(error){
        next(error);
        return;
    }
}

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