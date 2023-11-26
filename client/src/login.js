import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './styles/login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 추가
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      alert(response.data.message);

      localStorage.setItem('token', response.data.token);
      
      navigate('/main'); 
    } catch (error) {
      console.error(error);
      alert('로그인 실패');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>로그인</h2>
        <label className="label">아이디:</label>
        <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label className="label">비밀번호:</label>
        <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button" onClick={handleLogin}>
          로그인
        </button>
        <div className="link">
          <a href="/signup">회원가입</a>
          <span> · </span>
          <a href="/forgot-password">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
};

export default Login;