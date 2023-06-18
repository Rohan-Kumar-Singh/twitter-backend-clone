const tweetModel = require('../models/tweetModel');

// Controller method for posting a tweet
exports.postTweet = async (req, res) => {
  const { userId, content } = req.body;

  try {
    // Validate request data
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Call the model method to create a new tweet
    await tweetModel.createTweet(userId, content);
    return res.status(201).json({ message: 'Tweet posted successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to post tweet' });
  }

};

// Controller method for retrieving tweets from followed users
exports.getFollowedTweets = async (req, res) => {
  const { userId } = req.body;
  const { limit } = req.body;
  const { page } = req.body;

  try {

    //Implementing pagination.
    //Define the offset based on the page and limit values
    const offset = (page - 1) * limit;

    // Call the model method to get tweets from followed users
    const result = await tweetModel.getFollowedTweets(userId, offset, limit);
    return res.status(200).json({ tweets: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to fetch tweets' });
  }

};

// Controller method for searching tweets by keyword
exports.getSearchedTweets = async (req, res) => {
  const { keyword } = req.body;
  const { limit } = req.body;
  const { page } = req.body;

  try {

    //Implementing pagination.
    //Define the offset based on the page and limit values
    const offset = (page - 1) * limit;

    // Call the model method to search for tweets
    const result = await tweetModel.searchTweets(keyword, offset, limit);
    return res.status(200).json({ tweets: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to fetch tweets' });
  }
  
};
