import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';

export default function Login() {
  const [usersId, setUsersId] = useState('');
  const [usersPw, setUsersPw] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = { usersId, usersPw };
    
    try {
        const res = await axios.post(`/api/users/login`, payload);
        const user = res.data;
        console.log("users 객체:", user);

        if (user && user.usersId) {
          dispatch(login(user)); //로그인 정보 저장 & app.js > authSlice.js
          alert(`${user.usersName}님 환영합니다!`);
          navigate('/work');
        } else {
          alert('로그인 실패: 사용자 정보를 확인하세요.');
        }

    } catch (err) {
        console.error('로그인 오류:', err);
        alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }

  };


  {/*<div style={{ padding: '2rem' }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디: </label>
          <input value={usersId} onChange={(e) => setUsersId(e.target.value)} />
        </div>
        <div>
          <label>비밀번호: </label>
          <input type="password" value={usersPw} onChange={(e) => setUsersPw(e.target.value)} />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>*/}

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>아이디 : </label>
          <input
            type="text"
            value={usersId}
            onChange={(e) => setUsersId(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>비밀번호 : </label>
          <input
            type="password"
            value={usersPw}
            onChange={(e) => setUsersPw(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  
  );
}
