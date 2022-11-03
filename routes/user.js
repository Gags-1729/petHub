const router = require('express').Router();
const userController = require('../controllers/user');


// register new user
router.post('/register', userController.user_register);

// get all the users
router.get('/users/', userController.user_find_all);

// get a specific user
router.get('/users/:id', userController.user_find_one);

module.exports=router