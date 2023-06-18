const express = require('express');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
