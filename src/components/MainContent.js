
// ✅ <Outlet />으로 페이지 내용 렌더링

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainContent() {
  return (
    <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
      <Outlet />
    </main>
  );
}
