const db = require('../db');
const bcrypt = require('bcrypt');

class User {
  // Method for creating a new user
  static create(user) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.insertId);
      });
    });
  }

  // Method for getting a user by ID
  static getById(userId) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', userId, (err, result) => {
        if (err) {
          reject(err);
          console.log(err);
          return;
        }
        resolve(result[0]);
      });
    });
  }

  // Method for getting a user by email
  static getByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
          reject(err);
          console.log(err);
          return;
        }
        resolve(result[0]);
      });
    });
  }
  
  // Method for updating a user's password
  static updatePassword(userId, newPassword) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  // Verifying a password
  static verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Method for a user to follow another user
  static followUser(followerUserId, followedUserId) {
    const query = 'INSERT INTO followers (follower_user_id, followed_user_id) VALUES (?, ?)';
    return db.promise().query(query, [followerUserId, followedUserId]);
  }

  // Method for a user to unfollow another user
  static unfollowUser(followerUserId, followedUserId) {
    const query = 'DELETE FROM followers WHERE follower_user_id = ? AND followed_user_id = ?';
    return db.promise().query(query, [followerUserId, followedUserId]);
  }

}

module.exports = User;
