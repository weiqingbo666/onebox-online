import mysql from 'mysql2/promise';

// const dbConfig = {
//   host: 'localhost',
//   post: '3306',
//   user: 'root',
//   password: '123456',
//   database: 'onebox',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

const dbConfig = {
  host: 'gz-cdb-3d9ehih5.sql.tencentcdb.com',
  user: 'onebox',
  password: '9TXMan.!g9jfv7K',
  database: 'onebox',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export default pool;
