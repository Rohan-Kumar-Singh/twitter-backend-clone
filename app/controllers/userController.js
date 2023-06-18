const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../db');

class UserController {

    //Method for registering user a new user
    static async registerUser(req, res) {
        try {
          const { username, email, password } = req.body;
          const existingUser = await User.getByEmail(email);

          //Check if user exists
          if (existingUser) {
            res.status(409).json({ error: 'Email is already registered' });
            return;
          }
          //Hash the password for security
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = { username, email, password: hashedPassword };
          //create user in database
          const userId = await User.create(user);
          res.json({ userId });
        } catch (error) {
          res.status(500).json({ error: 'Failed to register user' });
        }
      }

  //Method to reset password
  static async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      //Get user by email
      const user = await User.getByEmail(email);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      //Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      //update password in database
      await User.updatePassword(user.id, hashedPassword);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  //Method to log in
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      //get user by email
      const user = await User.getByEmail(email);
      if (!user) {
        console.log(user);
        res.status(404).json({ error: 'User not found' });
        return;
      }

      //verify password
      const passwordMatch = await User.verifyPassword(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      //Create JSON web Token for authentication
      const token = jwt.sign({ userId: user.id }, 'your_secret_key');
      res.json({ token });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  // Method for following a user
  static async followUser(req, res) {
    try {
      const { userId } = req.params;
      // Get the logged-in user
      const user = await User.getById(req.user.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      //update database to add follower
      await User.followUser(user.id , userId);
  
      res.json({ message: 'User followed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to follow user' });
    }
  }

  //Method for unfollowing a user
  static async unfollowUser(req, res) {
    try {
      const { userId } = req.params;

      //get the logged in user
      const user = await User.getById(req.user.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      //Update database to remove follower
      await User.unfollowUser(user.id, userId); 
  
      res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to unfollow user' });
    }
  }
}

module.exports = UserController;
