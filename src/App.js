
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
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';


//<BrowserRouter>
//리액트 라우터 전체를 감싸는 최상위 컴포넌트입니다.
//이 안에서만 <Routes> 와 <Link> 같은 라우터 기능을 사용할 수 있습니다.
//브라우저의 주소를 감시하며 페이지를 전환합니다 (SPA, Single Page Application).

//<Routes>
//여러 개의 <Route>를 모아주는 컨테이너입니다.
//URL 주소에 따라 어떤 화면을 보여줄지 결정합니다.

//index는 **path 없이 "기본 경로"**를 의미합니다.
//path="/" 대신 index를 쓰면 부모 Route의 기본 자식 경로가 됩니다.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}