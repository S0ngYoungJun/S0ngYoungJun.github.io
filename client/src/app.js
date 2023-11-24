import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { userId });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  const handlePost = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/post', { userId, content });
      alert(response.data.message);
      handleLoadPosts();
    } catch (error) {
      console.error(error);
      alert('Failed to create post');
    }
  };

  const handleLoadPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load posts');
    }
  };

  return (
    <div>
      <h1>Social Media App</h1>
      <div>
        <label>User ID: </label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
        <label>Post Content: </label>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={handlePost}>Post</button>
      </div>
      <div>
        <button onClick={handleLoadPosts}>Load Posts</button>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;