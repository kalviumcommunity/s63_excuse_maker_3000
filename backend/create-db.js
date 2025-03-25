require('dotenv').config();
const mysql = require('mysql2');

// Create a connection to MySQL server (without specifying a database)
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    process.exit(1);
  }
  
  console.log('Connected to MySQL server');
  
  // Create the database if it doesn't exist
  const dbName = process.env.DB_NAME || 'excuse_maker';
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
    if (err) {
      console.error(`Error creating database ${dbName}:`, err);
      process.exit(1);
    }
    
    console.log(`Database ${dbName} created or already exists`);
    
    // Close the connection
    connection.end((err) => {
      if (err) {
        console.error('Error closing connection:', err);
        process.exit(1);
      }
      
      console.log('Connection closed');
      process.exit(0);
    });
  });
});