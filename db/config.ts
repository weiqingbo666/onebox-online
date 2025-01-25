import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'gz-cdb-3d9ehih5.sql.tencentcdb.com',
  port: 26921, 
  user: 'onebox',
  password: '9TXMan.!g9jfv7K',
  database: 'onebox',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00', // 使用中国时区
  dateStrings: true,  // 将日期作为字符串返回
  enableKeepAlive: true, // 启用连接保活
  keepAliveInitialDelay: 0 // 立即开始保活
};

const pool = mysql.createPool(dbConfig);

// 测试连接并设置错误处理
pool.on('connection', (connection) => {
  console.log('New connection established with threadId:', connection.threadId);
  
  connection.on('error', (err) => {
    console.error('Database connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  });
});

// 初始测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection test successful');
    connection.release();
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

testConnection();

export default pool;

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
