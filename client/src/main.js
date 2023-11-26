import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/main.css'; // main.css 파일 import

function Main() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPostText, setNewPostText] = useState('');

  useEffect(() => {
    // 포스트 목록을 가져오는 로직
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/posts');
        setPosts(response.data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    // 현재 로그인된 사용자의 정보를 가져오는 로직
    const fetchUserData = async () => {
      try {
        // 로컬 스토리지에서 토큰을 가져옴
        const token = localStorage.getItem('token');
        if (token) {
          // 토큰을 헤더에 추가하여 서버에 요청
          const response = await axios.get('http://localhost:3001/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsername(response.data.username);
          setEmail(response.data.email);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
    fetchUserData();
  }, []);

  const handlePostSubmit = async () => {
    try {
      // 로컬 스토리지에서 토큰을 가져옴
      const token = localStorage.getItem('token');
      
      // 토큰이 없다면 로그인 페이지로 이동하거나 다른 처리를 수행할 수 있습니다.
      if (!token) {
        alert('로그인이 필요합니다.');
        // 로그인 페이지로 이동 또는 다른 처리
        return;
      }
  
      const response = await axios.post(
        'http://localhost:3001/api/posts',
        { text: newPostText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(response.data.message);
      setPosts([...posts, response.data.newPost]);
      setNewPostText('');
    } catch (error) {
      console.error(error);
      alert('포스트 등록 실패');
    }
  };

  return (
    <div className="main-container">

      <div className="user-info">
        {/* 로그인된 사용자 정보 */}
        <p>{username}</p>
        <p>{email}</p>
      </div>

      <div className="post-form-container">
        {/* 포스트 작성 폼 */}
        <textarea placeholder={`안녕하세요, ${username}! 어떤 생각을 하고 계신가요?`}
        value={newPostText}
        onChange={(e) => setNewPostText(e.target.value)} />
        <button onClick={handlePostSubmit} >포스트</button>
      </div>

      <div className="post-list-container">
        {/* 포스트 목록 */}
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p>{post.text}</p>
            <span>작성자: {post.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;