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
            res.status(200).send("User registered successfully");
        })
    } catch (err) {
        next(err);
        return;
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