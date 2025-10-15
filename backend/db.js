const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',   // adjust if needed
  database: 'catms'
}).promise();

module.exports = db;