const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  module.exports = authMiddleware;
  

module.exports = authMiddleware;
