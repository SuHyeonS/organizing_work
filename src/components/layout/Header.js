
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function Header() {
  const { isLoggedIn, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="layout-header" style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <nav>
        <Link to="/a">A 메뉴</Link> | <Link to="/b">B 메뉴</Link>
        {isLoggedIn ? (
          <>
            {' '}| <span>{username}님</span>
            {' '}<button onClick={handleLogout}>로그아웃</button>
          </>
        ) : null}
      </nav>
    </header>
  );
}
