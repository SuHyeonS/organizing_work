
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import WorkList from '../pages/work/WorkList';
import CallCenter from '../pages/work/CallCenter';

import '../components/layout/Layout.css';

export default function ARoutes() {
  return (
    <div className="section">
      <aside className="sidebar">
        <nav>
          <Link to="/work/workList">업무목록</Link><br />
          <Link to="/work/callCenter">콜센터</Link>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="workList" replace />} />
          <Route path="workList" element={<WorkList />} />
          <Route path="callCenter" element={<CallCenter />} />
        </Routes>
      </main>
    </div>
  );
}
