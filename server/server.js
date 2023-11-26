const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const generateAccessToken = (username) => {
  return jwt.sign({ username }, 'your-secret-key', { expiresIn: '15m' });
};

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

app.post('/api/login', async (req, res) => {
  // 로그인 로직

  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const rows = await connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);
    connection.release();

    if (rows.length === 1) {
      const accessToken = generateAccessToken(username);
      res.json({ message: 'Login successful', token: accessToken });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 포스트 목록 조회
app.get('/api/posts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query('SELECT * FROM posts');
    connection.release();
    res.json({ posts: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  const { text: newPostText } = req.body;

  try {
    const { username } = req.user;

    const connection = await pool.getConnection();
    const result = await connection.query('INSERT INTO posts (username, text) VALUES (?, ?)', [username, newPostText]);
    connection.release();

    const newPost = {
      id: result.insertId,
      username,
      text: newPostText,
    };

    res.json({ message: '포스트가 성공적으로 등록되었습니다.', newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/user', authenticateToken, (req, res) => {
  res.json({ username: req.user.username, email: req.user.email });
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