import mysql from 'mysql2/promise';

const mysqlPool = mysql.createPool({
  host: "localhost",     // Your MySQL host
  user: "root",     // Your MySQL username
  password: "dhondup123", // Your MySQL password
  database: "Users", // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,              // Adjust as needed
  queueLimit: 0
});

export default mysqlPool;
