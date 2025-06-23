
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Aaa from '../pages/aaa/Aaa';
import Abb from '../pages/aaa/Abb';

export default function ARoutes() {
  return (
    <div className="section">
      <aside className="sidebar">
        <nav>
          <Link to="/a/aa">A - 메뉴1</Link><br />
          <Link to="/a/bb">A - 메뉴2</Link>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route index element={<Navigate to="aa" replace />} />
          <Route path="aa" element={<Aaa />} />
          <Route path="bb" element={<Abb />} />
        </Routes>
      </main>
    </div>
  );
}
