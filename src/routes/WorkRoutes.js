
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import WorkList from '../pages/work/workList/WorkList';
import WorkDetail from '../pages/work/workDetail/WorkDetai';
import CallCenter from '../pages/work/callCenter/CallCenter';

import '../components/layout/Layout.css';

export default function ARoutes() {
  return (
    <div className="section">
      <aside className="sidebar">
        <nav>
          <Link to="/work/workDetail">일일목록</Link><br />
          <Link to="/work/workList">업무목록</Link><br />
          <Link to="/work/callCenter">콜센터</Link>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="workDetail" replace />} />
          <Route path="workDetail" element={<WorkDetail />} />
          <Route path="workList" element={<WorkList />} />
          <Route path="callCenter" element={<CallCenter />} />
        </Routes>
      </main>
    </div>
  );
}
