import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkList.css";

import SearchBar from "../../components/layout/SearchBar";

export default function WorkList() {
  const [workList, setWorkList] = useState([]); //검색 목록

  const [loading, setLoading] = useState(true); //로딩
  const [searchInput, setSearchInput] = useState(""); //검색어

  const [editIndex, setEditIndex] = useState(null);
  const [newRows, setNewRows] = useState([]);


function getWorkList(){

  axios
    .get("/api/work/list", { params: { keyword: searchInput } })
    .then((res) => {
      setWorkList(res.data);
    })
    .catch((err) => console.error("검색 오류:", err));
}

// 검색 버튼 클릭 시 실행
const handleSearchClick = () => {
  axios
    .get("/api/work/list", { params: { keyword: searchInput } })
    .then((res) => {
      setWorkList(res.data);
    })
    .catch((err) => console.error("검색 오류:", err));
};

  // 목록 조회
  useEffect(() => {
    //handleSearchClick()
    /*
    if (!searchInput.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }
    */
    axios.get("/api/work/list")
      //.then((res) => setWorkList(res.data))
      .then((res) => {
        console.log('data : ', res.data);
        setWorkList(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("조회 오류:", err));
  }, []);

  

  // 수정 버튼
  const handleEdit = (index) => setEditIndex(index);

  // 수정 중 값 변경
  const handleChange = (index, field, value) => {
    const updated = [...workList];
    updated[index][field] = value;
    setWorkList(updated);
  };

  // 새 행 추가
  const handleAddRow = () => {
    setNewRows([
      ...newRows,
      {
        workTitle: "",
        workRequester: "",
        workRequestDate: "",
        workCompletionDate: "",
        workContents: "",
        workEtc: "",
        workExpectedStartDate: "",
        workExpectedEndDate: "",
        workProgressStartDate: "",
        workProgressEndDate: "",
        workSituation: "",
      },
    ]);
  };

  // 새 행 값 변경
  const handleNewChange = (index, field, value) => {
    const updated = [...newRows];
    updated[index][field] = value;
    setNewRows(updated);
  };

  // 전체 저장
  const handleSaveAll = () => {
    const payload = [...workList, ...newRows];
    axios.post("/api/work/saveAll", payload)
      .then(() => {
        alert("저장되었습니다!");
        setEditIndex(null);
        setNewRows([]);
        return axios.get("/api/work");
      })
      .then((res) => setWorkList(res.data))
      .catch((err) => console.error("저장 오류:", err));
  };

  const fields = [
    { key: "workTitle", label: "제목", type: "text" },
    { key: "workRequester", label: "요청자", type: "text" },
    { key: "workRequestDate", label: "요청일", type: "date" },
    { key: "workCompletionDate", label: "완료일", type: "date" },
    { key: "workContents", label: "내용", type: "text" },
    { key: "workEtc", label: "비고", type: "text" },
    { key: "workExpectedStartDate", label: "예정시작", type: "date" },
    { key: "workExpectedEndDate", label: "예정종료", type: "date" },
    { key: "workProgressStartDate", label: "진행시작", type: "date" },
    { key: "workProgressEndDate", label: "진행종료", type: "date" },
    { key: "workSituation", label: "상태", type: "text" },
  ];

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>

      {/* 검색바 */}
      <div className="search-bar">
        <SearchBar
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={handleSearchClick}
        />
      </div>

      <div style={{ margin: "10px 0px 10px 0px" }}>
        <button onClick={handleAddRow}>+ 행 추가</button>
        <button onClick={handleSaveAll} style={{ marginLeft: "8px" }}>
          💾 전체 저장
        </button>
      </div>
      
      {/* 컬럼 헤더 */}
      <div className="list-row" style={{ fontWeight: "bold", background: "#dfe6e9" }}>
        {fields.map((f) => (
          <div key={f.key} className="list-cell">{f.label}</div>
        ))}
        <div className="list-cell">작업</div>
      </div>

      {/* 기존 목록 */}
      {workList.map((work, index) => (
        <div key={work.workPk} className="list-row">
          {fields.map((f) => (
            <div key={f.key} className="list-cell">
              {editIndex === index ? (
                <input
                  type={f.type}
                  className="input-box"
                  value={work[f.key] || ""}
                  onChange={(e) => handleChange(index, f.key, e.target.value)}
                />
              ) : (
                work[f.key] || "-"
              )}
            </div>
          ))}
          <button onClick={() => handleEdit(index)}>수정</button>
        </div>
      ))}

      {/* 신규 추가 입력행 */}
      {newRows.map((row, index) => (
        <div key={`new-${index}`} className="input-row">
          {fields.map((f) => (
            <input
              key={f.key}
              type={f.type}
              className="input-box"
              placeholder={f.label}
              value={row[f.key] || ""}
              onChange={(e) => handleNewChange(index, f.key, e.target.value)}
            />
          ))}
        </div>
      ))}

      
    </div>
  );
}
