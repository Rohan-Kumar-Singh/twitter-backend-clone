const tweetController = require('../controllers/tweetController');
const tweetModel = require('../models/tweetModel');

jest.mock('../models/tweetModel');

describe('Tweet Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postTweet method', () => {
    test('should return a 400 status code and an error message when the content is not provided in the request body', async () => {
      await tweetController.postTweet(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Content is required' });
    });

    test('should return a 201 status code and a success message when the content is provided in the request body and the tweet is successfully created', async () => {
      req.body.userId = 'testUserId';
      req.body.content = 'testContent';
      tweetModel.createTweet.mockResolvedValueOnce();
      await tweetController.postTweet(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tweet posted successfully' });
    });
  });

  describe('getFollowedTweets method', () => {
    test('should return a 200 status code and an array of tweets when called with a valid user ID', async () => {
      req.user.userId = 'testUserId';
      const mockTweets = [{ id: 'tweet1' }, { id: 'tweet2' }];
      tweetModel.getFollowedTweets.mockResolvedValueOnce(mockTweets);
      await tweetController.getFollowedTweets(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tweets: mockTweets });
    });

    test('should return a 500 status code and an error message when an error occurs while fetching tweets', async () => {
      req.user.userId = 'testUserId';
      tweetModel.getFollowedTweets.mockRejectedValueOnce(new Error());
      await tweetController.getFollowedTweets(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch tweets' });
    });
  });

  describe('getSearchedTweets method', () => {
    test('should return a 200 status code and an array of tweets when called with a valid keyword', async () => {
      req.body.keyword = 'testKeyword';
      const mockTweets = [{ id: 'tweet1' }, { id: 'tweet2' }];
      tweetModel.searchTweets.mockResolvedValueOnce(mockTweets);
      await tweetController.getSearchedTweets(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tweets: mockTweets });
    });

    test('should return a 500 status code and an error message when an error occurs while searching for tweets', async () => {
      req.body.keyword = 'testKeyword';
      tweetModel.searchTweets.mockRejectedValueOnce(new Error());
      await tweetController.getSearchedTweets(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch tweets' });
    });
  });
});
