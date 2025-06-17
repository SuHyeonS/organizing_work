
// ✅ 라우터 경로: / (홈 페이지)

import React from 'react';
import Counter from '../features/counter/Counter';

export default function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page.</p>
      <Counter />
    </div>
  );
}