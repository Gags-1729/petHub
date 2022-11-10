const router = require('express').Router();
const userController = require('../controllers/user');
const authenticate = require('../middleware/authenticate')

// register new user
router.post('/register',authenticate, userController.user_register);

// verify the user
router.get('/verify/:us', userController.user_verify);

// login the user
router.get('/login', authenticate, userController.user_login);

// check if the user has been verified and login it
router.get('/verify-and-login/:email', authenticate, userController.user_verify_and_login);

// get all the users
router.get('/users/', authenticate, userController.user_find_all);

// get a specific user
router.get('/users/:id', authenticate, userController.user_find_one);

module.exports=router