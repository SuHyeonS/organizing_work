
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import WorkMain from '../pages/work/workMain/WorkMain';
import CallCenter from '../pages/work/callCenter/CallCenter';

import '../components/layout/Layout.css';

export default function ARoutes() {
  return (
    <div className="section">
      <aside className="sidebar">
        <nav>
          <Link to="/work/workMain">업무목록</Link><br />
          <Link to="/work/callCenter">콜센터</Link>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="workMain" replace />} />
          <Route path="workMain" element={<WorkMain />} />
          <Route path="callCenter" element={<CallCenter />} />
        </Routes>
      </main>
    </div>
  );
}
