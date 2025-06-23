
import React from 'react';
import './SearchBar.css'; // 버튼 스타일이 여기에 있다면 포함

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="검색어 입력"
        className="search-input"
      />
      <button onClick={onSearch} className="search-button">
        검색
      </button>
    </div>
  );
}