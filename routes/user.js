const router = require('express').Router();
const userController = require('../controllers/user');
const authenticate = require('../middleware/authenticate')

// register new user
router.post('/register',authenticate, userController.user_register);

// verify the user
router.get('/verify/:us', userController.user_verify);

// get all the users
router.get('/users/', authenticate, userController.user_find_all);

// get a specific user
router.get('/users/:id', authenticate, userController.user_find_one);

module.exports=router