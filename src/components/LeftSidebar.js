
// ✅ 사이드 메뉴

import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LeftSidebar() {
  return (
    <nav style={{
      width: '200px',
      backgroundColor: '#f0f0f0',
      padding: '1rem',
      borderRight: '1px solid #ccc',
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.5rem 0',
              color: isActive ? 'blue' : 'black',
              textDecoration: 'none',
            })}
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              display: 'block',
              padding: '0.5rem 0',
              color: isActive ? 'blue' : 'black',
              textDecoration: 'none',
            })}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}