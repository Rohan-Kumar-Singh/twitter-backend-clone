CREATE DATABASE twitter_clone;
USE twitter_clone;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE followers (
  follower_user_id INT NOT NULL,
  followed_user_id INT NOT NULL,
  FOREIGN KEY (follower_user_id) REFERENCES users(id),
  FOREIGN KEY (followed_user_id) REFERENCES users(id),
  PRIMARY KEY (follower_user_id)
);