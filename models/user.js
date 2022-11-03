const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    location: {
        type: String
    },
    phone: {
        type: String
    }
})

const User = mongoose.model('User', userSchema);
module.exports=User