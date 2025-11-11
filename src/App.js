
/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

// ✅ 라우터 설정, 최상위 컴포넌트
//🧩 화면 전체를 구성하는 기본 틀


//<BrowserRouter>
//리액트 라우터 전체를 감싸는 최상위 컴포넌트입니다.
//이 안에서만 <Routes> 와 <Link> 같은 라우터 기능을 사용할 수 있습니다.
//브라우저의 주소를 감시하며 페이지를 전환합니다 (SPA, Single Page Application).

//<Routes>
//여러 개의 <Route>를 모아주는 컨테이너입니다.
//URL 주소에 따라 어떤 화면을 보여줄지 결정합니다.

//index는 **path 없이 "기본 경로"**를 의미합니다.
//path="/" 대신 index를 쓰면 부모 Route의 기본 자식 경로가 됩니다.


import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import { initialize } from './features/auth/authSlice';

//메뉴
import WorkRoutes from './routes/WorkRoutes';
import AdminRoutes from './routes/AdminRoutes';

function PrivateRoute({ element }) {
  const { isLoggedIn, isInitialized } = useSelector((state) => state.auth);
  if (!isInitialized) return <div>Loading...</div>;
  return isLoggedIn ? element : <Navigate to="/login" replace />;
}


export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    console.log("로그인 유저 : ", stored);
    if (stored) {
      const parsed = JSON.parse(stored);
      dispatch(initialize(parsed));
    } else {
      dispatch(initialize({ isLoggedIn: false, username: '' }));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<Navigate to="/work" replace />} />
          <Route path="work/*" element={<WorkRoutes />} />
          <Route path="admin/*" element={<AdminRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}