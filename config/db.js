import mysql from 'mysql2/promise'; 

const connectDB = mysql.createPool({
    host: '92.205.250.129',
    user: 'shahbaz07',
    password: 'shahbaz2007.',
    database: 'sellit-pakistan',
    port: 3306,
    // host: 'localhost',
    // user: 'root',
    // password: 'shahbaz2007',
    // database: 'sellit_pakistan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


export default connectDB;
