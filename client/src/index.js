import React from 'react';
import ReactDOM from 'react-dom';

import SignUp from './SignUp';
import Login from './login'
import MainComponent from './main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} /> {/* 기본 페이지는 로그인 페이지로 */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/main" element={<MainComponent />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);