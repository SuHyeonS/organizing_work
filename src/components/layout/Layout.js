
// ✅ 전체 레이아웃 구성

//import React, { useState } from 'react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';



export default function Layout() {

    /*
  return (
    <div className="layout">
      <Header />
      <SearchBar onSearch={setSearchTerm} />
      <main style={{ padding: '1rem' }}>
        <Outlet context={{ searchTerm }} />
      </main>
      <Footer />
    </div>
  );

*/

  return (
    <div className="layout">
      <Header />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


