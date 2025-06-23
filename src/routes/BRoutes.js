
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Baa from '../pages/bbb/Baa';
import Bbb from '../pages/bbb/Bbb';

export default function BRoutes() {
  return (
    <div className="section">
      <aside className="sidebar">
        <nav>
          <Link to="/b/aa">B - 메뉴1</Link><br />
          <Link to="/b/bb">B - 메뉴2</Link>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="aa" replace />} />
          <Route path="aa" element={<Baa />} />
          <Route path="bb" element={<Bbb />} />
        </Routes>
      </main>
    </div>
  );
}