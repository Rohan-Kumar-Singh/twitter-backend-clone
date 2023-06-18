const db = require('../db');

// Model method for posting a tweet
exports.createTweet = (userId, content) => {
  return new Promise((resolve, reject) => {
    // Insert the tweet into the database
    const query = 'INSERT INTO tweets (user_id, content) VALUES (?, ?)';
    db.query(query, [userId, content], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

// Model method for retrieving tweets from followed users
exports.getFollowedTweets = (userId, offset, limit) => {
  return new Promise((resolve, reject) => {
    // Fetch the tweets from followed users
    const query = `
      SELECT tweets.*
      FROM tweets
      JOIN followers AS f ON f.followed_user_id = tweets.user_id
      JOIN users AS u ON u.id = tweets.user_id
      WHERE f.follower_user_id = ?
      ORDER BY tweets.timestamp DESC
      LIMIT ?, ?
    `;
    db.query(query, [userId, offset, limit], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

// Model method for searching tweets by keyword
exports.searchTweets = (keyword, offset, limit) => {
  return new Promise((resolve, reject) => {
    // Fetch the tweets that match the keyword
    const query = `
      SELECT tweets.*
      FROM tweets
      WHERE tweets.content LIKE ?
      ORDER BY tweets.timestamp DESC
      LIMIT ?, ?
    `;
    db.query(query, [`%${keyword}%`, offset, limit], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
