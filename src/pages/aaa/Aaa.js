
import React, { useState } from 'react';
import SearchBar from '../../components/layout/SearchBar';
import '../../components/layout/Layout.css';

import './Aaa.css';

export default function Aaa() {
  const [rows, setRows] = useState([
    ['항목 1-1', '항목 1-2', '항목 1-3', '항목 1-4', '항목 1-5']
  ]);
  const [newRows, setNewRows] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter(row =>
    row.some(col => col.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClick = () => {
    setNewRows([...newRows, ['', '', '', '', '']]);
  };

  const handleChange = (rowIndex, colIndex, value) => {
    const updated = newRows.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((col, cIdx) => (cIdx === colIndex ? value : col)) : row
    );
    setNewRows(updated);
  };

  const handleSave = () => {
    const validRows = newRows.filter(row => row.some(val => val.trim() !== ''));
    if (validRows.length > 0) {
      setRows([...rows, ...validRows]);
      setNewRows([]);
    }
  };

  const handleDeleteNewRow = (index) => {
    setNewRows(newRows.filter((_, i) => i !== index));
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSearchClick = () => {
    setSearchTerm(searchInput);
  };

  return (
    <div className="main-container">
      <h2 className="page-title">Aaa Page</h2>

      {/* 검색바 */}
      <div className="search-bar">
        <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearchClick}
          />
      </div>

      {/* 리스트 */}
      <div className="list-section">
        {filteredRows.map((row, rowIndex) => (
          <div key={rowIndex} className="list-row">
            {row.map((col, colIndex) => (
              <div key={colIndex} className="list-cell">
                {col}
              </div>
            ))}
            <button onClick={() => handleDeleteRow(rowIndex)}>삭제</button>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      {newRows.map((row, rowIndex) => (
        <div key={rowIndex} className="input-row">
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              type="text"
              value={value}
              placeholder={`열 ${colIndex + 1}`}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className="input-box"
            />
          ))}
          <button onClick={() => handleDeleteNewRow(rowIndex)}>삭제</button>
        </div>
      ))}

      <div className="button-group">
        <button onClick={handleAddClick}>+ 항목 추가</button>
        {newRows.length > 0 && (
          <button onClick={handleSave}>저장</button>
        )}
      </div>
    </div>
  );
}
