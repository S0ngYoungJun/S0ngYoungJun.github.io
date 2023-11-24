import React, { useState } from 'react';
import axios from 'axios';
import './styles/SignUp.css'; 

function SignUp() {
  const [username, setUsername] = useState('');
  const [password,  setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/signup', {
        username,
        password,
        name,
        gender,
        phone,
        birthdate,
        email,
      });
      console.log('Server response:', response.data);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Failed to sign up');
    }
  };

  return (
    <div className="container">
  <div className="form-container">
    <h2>회원가입</h2>

    {/* 아이디 입력 부분 */}
    <div>
      <label className="label">아이디: </label>
      <input
        type="text"
        className="input"
        placeholder="아이디를 입력하세요"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>

    {/* 비밀번호 입력 부분 */}
    <div>
      <label className="label">비밀번호: </label>
      <input
        type="password"
        className="input"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* 이름 입력 부분 */}
    <div>
      <label className="label">이름: </label>
      <input
        type="text"
        className="input"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>

    {/* 성별 입력 부분 */}
    <div>
      <label className="label">성별: </label>
      <input
        type="text"
        className="input"
        placeholder="성별을 입력하세요"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
    </div>
    <div>

      <label className="label">휴대폰번호: </label>
      <input
        type="text"
        className="input"
        placeholder="휴대폰번호을 입력하세요"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>

    {/* 생일 입력 부분 */}
    <div>
      <label className="label">생년월일: </label>
      <input
        type="text"
        className="input"
        placeholder="생년월일을 입력하세요"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />
    </div>

    {/* 이메일 입력 부분 */}
    <div>
      <label className="label">이메일: </label>
      <input
        type="text"
        className="input"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* 회원가입 버튼 */}
    <button className="button" onClick={handleSignUp}>
      회원가입
    </button>
  </div>
</div>
  );
}
export default SignUp;