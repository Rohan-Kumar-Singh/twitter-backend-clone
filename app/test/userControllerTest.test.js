const UserController = require('../controllers/userController');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');

describe('UserController', () => {
  let req, res;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    sinon.stub(User, 'getByEmail');
    sinon.stub(User, 'create');
    sinon.stub(User, 'updatePassword');
    sinon.stub(User, 'verifyPassword');
    sinon.stub(User, 'followUser');
    sinon.stub(User, 'unfollowUser');
    sinon.stub(bcrypt, 'hash');
    sinon.stub(jwt, 'sign');
  });

  afterEach(() => {
    User.getByEmail.restore();
    User.create.restore();
    User.updatePassword.restore();
    User.verifyPassword.restore();
    User.followUser.restore();
    User.unfollowUser.restore();
    bcrypt.hash.restore();
    jwt.sign.restore();
    sinon.restore();
  });

  describe('.registerUser', () => {
    it('should register a new user', async () => {
      req.body = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      };
      User.getByEmail.returns(null);
      User.create.returns(1);
      bcrypt.hash.returns('hashedpassword');

      await UserController.registerUser(req, res);

      const response = JSON.parse(res._getData());
      expect(response.userId).toBe(1);
    });

    it('should return an error if email is already registered', async () => {
      req.body = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      };
      User.getByEmail.returns({ id: 1 });

      await UserController.registerUser(req, res);

      const response = JSON.parse(res._getData());
      expect(response.error).toBe('Email is already registered');
    });

    it('should return an error if registration fails', async () => {
      req.body = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      };
      User.getByEmail.returns(null);
      User.create.throws(new Error());

      await UserController.registerUser(req, res);

      const response = JSON.parse(res._getData());
      expect(response.error).toBe('Failed to register user');
    });
  });

  describe('.resetPassword', () => {
    it('should reset the password for a user', async () => {
      req.body = {
        email: 'testuser@example.com',
        newPassword: 'newpassword123'
      };
      User.getByEmail.returns({ id: 1 });
      bcrypt.hash.returns('hashedpassword');

      await UserController.resetPassword(req, res);

      const response = JSON.parse(res._getData());
      expect(response.message).toBe('Password reset successful');
    });

    it('should return an error if user is not found', async () => {
      req.body = {
        email: 'testuser@example.com',
        newPassword: 'newpassword123'
      };
      User.getByEmail.returns(null);

      await UserController.resetPassword(req, res);

      const response = JSON.parse(res._getData());
      expect(response.error).toBe('User not found');
    });

    it('should return an error if password reset fails', async () => {
      req.body = {
        email: 'testuser@example.com',
        newPassword: 'newpassword123'
      };
      User.getByEmail.returns({ id: 1 });
      bcrypt.hash.throws(new Error());

      await UserController.resetPassword(req, res);

      const response = JSON.parse(res._getData());
      expect(response.error).toBe('Failed to reset password');
    });
  });

  describe('.loginUser', () => {
    it('should log in a user and return a token', async () => {
      req.body = {
        email: 'testuser@example.com',
        password: 'password123'
      };
      User.getByEmail.returns({ id: 1, password: 'hashedpassword' });
      User.verifyPassword.returns(true);
      jwt.sign.returns('token');

       await UserController.loginUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.token).toBe('token');
     });

     it('should return an error if user is not found', async () => {
       req.body = {
         email: 'testuser@example.com',
         password: 'password123'
       };
       User.getByEmail.returns(null);

       await UserController.loginUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.error).toBe('User not found');
     });

     it('should return an error if password is invalid', async () => {
       req.body = {
         email: 'testuser@example.com',
         password: 'password123'
       };
       User.getByEmail.returns({ id: 1, password: 'hashedpassword' });
       User.verifyPassword.returns(false);

       await UserController.loginUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.error).toBe('Invalid password');
     });

     it('should return an error if login fails', async () => {
       req.body = {
         email: 'testuser@example.com',
         password: 'password123'
       };
       User.getByEmail.returns({ id: 1, password: 'hashedpassword' });
       User.verifyPassword.returns(true);
       jwt.sign.throws(new Error());

       await UserController.loginUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.error).toBe('Failed to login');
     });
   });

   describe('.followUser', () => {
     it('should follow a user', async () => {
       req.params = { userId: 2 };
       req.user = { userId: 1 };
       sinon.stub(User, 'getById').returns({ id: 1 });

       await UserController.followUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.message).toBe('User followed successfully');
     });

     it('should return an error if user is not found', async () => {
       req.params = { userId: 2 };
       req.user = { userId: 1 };
       sinon.stub(User, 'getById').returns(null);

       await UserController.followUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.error).toBe('User not found');
     });

     it('should return an error if follow fails', async () => {
       req.params = { userId: 2 };
       req.user = { userId: 1 };
       sinon.restore();
       sinon.stub(User, 'getById').returns({ id: 1 });
       sinon.stub(User, 'followUser').throws(new Error());

       await UserController.followUser(req, res);

       const response = JSON.parse(res._getData());
       expect(response.error).toBe('Failed to follow user');
     });
   });

   describe('.unfollowUser', () => {
     it('should unfollow a user', async () => {
      req.params = { userId: 2 };
      req.user = { userId: 1 };
      sinon.restore();
      sinon.stub(User, 'getById').returns({ id: 1 });

      await UserController.unfollowUser(req, res);

      const response = JSON.parse(res._getData());
      expect(response.message).toBe('User unfollowed successfully');
    });

    it('should return an error if user is not found', async () => {
      req.params = { userId: 2 };
      req.user = { userId: 1 };
      sinon.restore();
      sinon.stub(User, 'getById').returns({ id: 1 });

      await UserController.unfollowUser(req, res);

      const response = JSON.parse(res._getData());
      expect(response.error).toBe('User not found');
    });

    it('should return an error if unfollow fails', async () => {
      req.params = { userId: 2 };
      req.user = { userId: 1 };
      sinon.restore();
      sinon.stub(User, 'getById').returns({ id: 1 });
      User.unfollowUser.throws(new Error());

      await UserController.unfollowUser(req, res);

      const response = JSON.parse(res._getData());
      expect(response.error).toBe('Failed to unfollow user');
    });
   });
});
