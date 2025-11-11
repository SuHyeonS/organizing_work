
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function Header() {
  //const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { isLoggedIn, user, isInitialized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="layout-header" style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <nav>
        <Link to="/work">업무관리</Link> | <Link to="/admin">관리자</Link> | 
        {isInitialized && isLoggedIn && user && (
          <>
            <span>{user.usersName}님</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        )}
      </nav>
    </header>
  );
}
