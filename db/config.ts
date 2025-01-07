// 数据库配置
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '123456',
  database: process.env.MYSQL_DATABASE || 'myform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接并确保表存在
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');

    // 读取初始化 SQL 文件
    const sqlPath = path.join(process.cwd(), 'db', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 按语句分割并执行
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('Database tables initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection/initialization error:', error);
    return false;
  }
}

// 测试连接
testConnection().catch(console.error);

export default pool;
