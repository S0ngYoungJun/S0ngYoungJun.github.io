import React, { useState } from 'react';
import axios from 'axios'
import './styles/login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      alert(response.data.message);
      // 로그인 성공 시 다음 동작을 수행하세요 (예: 페이지 이동 등)
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
        <input type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
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