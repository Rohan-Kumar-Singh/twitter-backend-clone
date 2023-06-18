# Twitter Backend Clone

This is a backend clone of Twitter, implemented using Node.js, Express.js, and MySQL. It provides APIs for user registration, login, posting tweets, following users, and searching tweets.

## Prerequisites

To run this project, make sure you have the following prerequisites installed on your system:

- Node.js (version 17 or higher)
- MySQL database

## Getting Started

To get started with the project, follow the instructions below.

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Install dependencies

Navigate to the project directory and install the required dependencies using npm:

```bash
cd twitter-backend-clone
npm install
```

### 3. Set up the database

Create a MySQL database named `twitter_clone`. You can configure the database credentials in the `db.js` file located in the root directory of the project.

### 4. Run the server

Start the server by running the following command:

```bash
npm run start
```

The server will start running on `http://localhost:3000`.

## API Endpoints

The following are the available API endpoints:

- `POST /users/register`: Register a new user. Required fields: `username`, `email`, `password`.
- `POST /users/login`: Login a user. Required fields: `email`, `password`.
- `POST /users/reset-password`: Reset the user's password. Required fields: `email`, `newPassword`.
- `POST /users/:userId/follow`: Follow a user. Required parameter: `userId`.
- `POST /users/:userId/unfollow`: Unfollow a user. Required parameter: `userId`.
- `POST /tweets`: Post a tweet. Required fields: `userId`, `content`.
- `GET /tweets/followed`: Get tweets from followed users.
- `GET /tweets/search`: Search tweets by keyword. Required query parameter: `keyword`.

**Note:** For protected routes (e.g., `POST /users/:userId/follow`, `POST /tweets`), you need to include an `Authorization` header with a valid JWT token. The token can be obtained by logging in.

## Docker

This project can also be run inside a Docker container. Follow the steps below to containerize the application.

### 1. Build the Docker image

```bash
docker build -t twitter-backend-clone .
```

### 2. Run the Docker container

```bash
docker run -p 3000:3000 twitter-backend-clone
```

The server will be accessible at `http://localhost:3000` from your host machine.

## Conclusion

You have successfully set up and run the Twitter Backend Clone project. You can now explore the API endpoints and integrate it with your frontend application.
