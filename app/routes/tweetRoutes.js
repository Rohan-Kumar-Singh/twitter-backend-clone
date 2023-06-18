const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Route for posting a tweet
router.post('/', authMiddleware, tweetController.postTweet);

// Route for retrieving tweets from followed users
router.get('/followed', authMiddleware, tweetController.getFollowedTweets);

//Route for retrieving tweet using keyword
router.get('/search', authMiddleware, tweetController.getSearchedTweets);

module.exports = router;
