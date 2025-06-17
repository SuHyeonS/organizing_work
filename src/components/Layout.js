
// ✅ 전체 레이아웃 구성

import React from 'react';
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';
import BottomBar from './BottomBar';
import MainContent from './MainContent';

export default function Layout() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <LeftSidebar />
        <MainContent />
      </div>
      <BottomBar />
    </div>
  );
}