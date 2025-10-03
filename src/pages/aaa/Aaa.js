
import React, { useState } from 'react';
import SearchBar from '../../components/layout/SearchBar';


import './Aaa.css';

export default function Aaa() {
  const [rows, setRows] = useState([
    ['일자', '대분류', '업무방법', '사업주체', '내용', '연락처', '처리자']
  ]);
  const [newRows, setNewRows] = useState([]); //신규 리스트
  const [searchInput, setSearchInput] = useState(''); //입력중인값
  const [searchTerm, setSearchTerm] = useState(''); //검색버튼클릭시 조회 할 값

  //검색

  const headerRow = rows[0]; // 항상 보여줄 헤더
  const dataRows = rows.slice(1); // 실제 데이터 행들만 분리

  //rows.filter(...): 전체 행 중 조건을 만족하는 행만 필터링.
  //row.some(...): 해당 행(row)의 어떤 열(col)이라도 검색어를 포함하는지 확인.
  //toLowerCase(): 대소문자 구분 없이 비교하려고 소문자 변환.
  //includes(): 특정 문자열이 포함되어 있는지 확인하는 함수.
  //typeof col === 'string' : null 오류 예외처리
  const filteredDataRows  = dataRows.filter(row =>
    row.some(col => 
      typeof col === 'string' && 
      col.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 헤더 + 필터링된 행들을 합쳐서 최종 출력 목록 구성
  const filteredRows = [headerRow, ...filteredDataRows];

  //항목 추가 함수
  //etNewRows([...newRows, ...]): 기존 배열 복사하고 마지막에 새 행 추가.
  const handleAddClick = () => {
    setNewRows([...newRows, ['', '', '', '', '', '', '']]);
  };

  //입력값 변경 함수
  //map(): 배열을 변형.
  //rIdx === rowIndex: 특정 행만 업데이트.
  //cIdx === colIndex: 특정 열만 업데이트.
  //불변성을 지키기 위해 새 배열을 만들어 setNewRows로 설정.
  //2차원 배열을 직접수정함.
  const handleChange = (rowIndex, colIndex, value) => {
    const updated = newRows.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((col, cIdx) => (cIdx === colIndex ? value : col)) : row
    );
    setNewRows(updated);
  };

  //신규행 추가
  //val.trim() !== '': 비어있는 행이 아닌 것만 필터링.
  //setRows([...rows, ...validRows]): 기존 행 + 새 입력 행 합치기.
  //setNewRows([]): 저장 후 입력창 비우기.
  const handleSave = () => {
    const validRows = newRows.filter(row => row.some(val => val.trim() !== ''));
    if (validRows.length > 0) {
      setRows([...rows, ...validRows]);
      setNewRows([]);
    }
  };

  //입력중인 행제거
  //filter((_, i) => i !== index): 해당 인덱스의 행을 제거한 새 배열로 설정.
  const handleDeleteNewRow = (index) => {
    setNewRows(newRows.filter((_, i) => i !== index));
  };

  //행제거
  // 아래 UI에서 rowIndex !== 0 조건으로 첫 번째 행은 삭제 못 함.
  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  //검색창의 현재 입력 값을 확정하여 searchTerm으로 저장.
  //이로 인해 위의 filteredRows가 새로 계산됨.
  const handleSearchClick = () => {
    setSearchTerm(searchInput);
  };

  return (
    <div className="main-container">
      <h2 className="page-title">Aaa Page</h2>

      {/* 
      검색바 
      onChange: 입력이 바뀔 때마다 searchInput 업데이트
      onSearch: 버튼 클릭 시 실행
      */}
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
            {/*
            <button onClick={() => handleDeleteRow(rowIndex)}>삭제</button>
             rowIndex가 0이면 삭제 버튼 안 보이게 
             */}
            {rowIndex !== 0 && (
              <button onClick={() => handleDeleteRow(rowIndex)}>삭제</button>
            )}
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
