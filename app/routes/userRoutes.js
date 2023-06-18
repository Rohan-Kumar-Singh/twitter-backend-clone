const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//Route to register new user
router.post('/register', UserController.registerUser);

//Route to reset password
router.post('/reset-password', UserController.resetPassword);

//Route to log in
router.post('/login', UserController.loginUser);

//Route to follow a user
router.post('/:userId/follow', authMiddleware, UserController.followUser);

//Route to unfollow a user
router.post('/:userId/unfollow', authMiddleware, UserController.unfollowUser);

module.exports = router;
