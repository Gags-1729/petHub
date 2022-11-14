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
    verified: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ['','Male', 'Female', 'Other'],
        default:""
    },
    location: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default:0
    },
    favorites: {
        type: Number,
        default:0
    }
})

const User = mongoose.model('User', userSchema);
module.exports=User