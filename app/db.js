const mysql = require('mysql2');

//Provide DB credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpswd',
  database: 'twitter_clone',
});

//Connect with MySQL database
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;
