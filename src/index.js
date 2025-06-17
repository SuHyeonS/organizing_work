
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/

// ✅ 앱 진입점, store + App 연결

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root')); //앱을 HTML에 띄우는 코드
root.render(
  <Provider store={store}>  {/*Redux를 React 전체에서 쓸 수 있게 연결*/}
    <App /> {/*컴포넌트들의 시작점*/}
  </Provider>
);