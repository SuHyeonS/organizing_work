
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

//메뉴
import Business from '../pages/admin/Business';
import DownloadReport from '../pages/admin/DownloadReport';
//import '../components/layout/Layout.css';

export default function BRoutes() {
  return (
    <div className="section">
      <aside className="sidebar">
        <nav>
          <Link to="/admin/business">사업관리</Link><br />
          <Link to="/admin/downloadReport">준공 보고서 다운로드</Link>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="business" replace />} />
          <Route path="business" element={<Business />} />
          <Route path="downloadReport" element={<DownloadReport />} />
        </Routes>
      </main>
    </div>
  );
}