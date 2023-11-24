const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;
const bcrypt = require('bcrypt');
app.use(cors());
app.use(bodyParser.json());

let users = {}; // For simplicity, storing users in-memory
let posts = []; // For simplicity, storing posts in-memory

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '723546',
  database: 'fareex',
  connectionLimit: 5,
  port:3306
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.post('/api/login', async (req, res) => {
  // 로그인 로직

  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const rows = await connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    connection.release();

    if (rows.length > 0) {
      res.json({ message: '로그인 성공', userId: rows[0].id });
    } else {
      res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/post', async (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: 'User ID and content are required' });
  }

  try {
    const connection = await pool.getConnection();
    const result = await connection.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);
    connection.release();

    res.json({ message: 'Post created successfully', postId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 게시물 조회
app.get('/api/posts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query('SELECT * FROM posts');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/api/signup', async (req, res) => {
  const { username, password, name, gender, phone, birthdate, email } = req.body;

  const missingFields = [];
  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');
  if (!name) missingFields.push('name');
  if (!gender) missingFields.push('gender');
  if (!phone) missingFields.push('phone');
  if (!birthdate) missingFields.push('birthdate');
  if (!email) missingFields.push('email');

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `다음 필드를 입력해주세요: ${missingFields.join(', ')}` });
  }

  try {
    // Check if the email is already registered
    const existingUser = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      'INSERT INTO user (username, password, name, gender, phone, birthdate, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, name, gender, phone, birthdate, email]
    );

    res.json({ message: 'Sign up successful', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});