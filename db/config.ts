import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'gz-cdb-3d9ehih5.sql.tencentcdb.com',
  port: 26921, 
  user: 'onebox',
  password: '9TXMan.!g9jfv7K',
  database: 'onebox',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


// 数据库配置
//   datasource:
//     driver-class-name: com.mysql.cj.jdbc.Driver
//     url: jdbc:mysql://gz-cdb-3d9ehih5.sql.tencentcdb.com:26921/underware
//     username: onebox
//     password: 9TXMan.!g9jfv7K

// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'onebox',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };



const pool = mysql.createPool(dbConfig);

export default pool;
