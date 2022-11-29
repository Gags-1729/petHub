const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const nodemailer = require('nodemailer')

const User = require('../models/user');
const UserVerification = require('../models/user_verification');

const createError = require('http-errors');

exports.user_register = async(req, res, next) => {

    try{
        const isRegistered = await User.findOne({ email: req.body.email })
        if(isRegistered){
            throw createError(400, "Email already exists");
        }
    }
    catch(err){
        next(err)
        return;
    }

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
            console.log("Registering user");
            console.log(result)
           sendMail(result,res);
        })
    } catch (err) {
        next(err);
        return;
    }
}

exports.user_login = async(req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email })

        if(!user){
            throw createError(404, "Email id does not exist")
        }
       
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            next(createError(400, "Incorrect password"));
            return;
        }
        
        if(!user.verified){
            next(createError(401, "Email not verified"))
            return;
        }
        res.send(user);
    } catch(error){
        next(error);
    }
}

exports.user_verify = async(req, res, next) => {
    const {us} = req.params;
    try{
        const user = await UserVerification.findOne({ uniqueString: us });
        if (user) {
            const tuser = await User.updateOne(
                { _id: user.userID },
                { verified: true }
            );
            if (tuser) {
                await UserVerification.deleteOne({ uniqueString: us });
                res.send("Verified");
              } else {
                res.send("Already verified");
              }
        }
        else {
            throw createError(404, "User not found");
        }        
    } catch(error){
        next(error);
    }
}


exports.user_verify_and_login = async(req, res, next) => {
    const {email} = req.params;
    try{
        const user = await User.findOne({ email: email});
        if(user){
            if(user.verified){
                res.status(200)
                .send(user);
            }
            else {
                res.status(401).send(user);
            }
        } else{
            throw createError(404, "User not found");
        }
    } catch(error){
        next(error);
    }
}

exports.user_find_all = async(req, res, next) => {
    try {
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

exports.user_edit_profile = async(req, res, next) => {
    try{
        const {_id, name, description, location, gender, phone} = req.body;
        const user = User.findOneAndUpdate({_id}, {name, description, location, gender, phone});
        console.log(name+" "+description+" "+location+" "+gender);
        console.log(user)
        if(user){
            res.status(200)
            .send({
                status:200,
                message:"Profile updated",
             })
        } else {
            next(404, "User not found");
        }
    } catch (error){
        next(error);
    }
}


// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASS
//     }
// })

// transporter.verify((error, success) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Connection to nodemailer");
//       console.log(success);
//     }
//   });


  // Send the email to user for verifying the account
const sendMail = ({name, _id, email}, res, next) => {

    const uniqueString = uuidv4() + _id;
    const curUrl = "http://pethub.herokuapp.com/" + "api/user/verify/" + uniqueString;

    const mailConfigurations = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'PetHub | Confirm your email address',
        html: `
        <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <body>
    <p>Welcome ${name},</p>
    <p></p>
    <p>Thankyou for connecting with us. Just a small step ahead. Click this button below to verify your account!</p>
    <a style={bgcolor="#FFA73B"} href="${curUrl}">Confirm Account</a>
    <p></p>
    <p>Just write out to this email if you have any queries</p>
    <p>Cheers from Team Gohaga!</p>
    `
    };
        
    transporter.sendMail(mailConfigurations, async function(error, response){
        if (error) {
            throw Error(error);
        }
        const userVerify = new UserVerification({
            userID: _id,
            uniqueString: uniqueString,
        });
        console.log(uniqueString);
        const savedVerify = await userVerify.save();
        console.log('Email Sent Successfully');
        res.status = 200;
        res.send({
            status: 200,
            message: "Email sent",
        });
    });
}