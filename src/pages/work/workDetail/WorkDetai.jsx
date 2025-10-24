//훅 
//useState: 상태(state) 관리
//useEffect: 컴포넌트가 처음 실행되거나 특정 값이 바뀔 때 동작
//useCallback: 함수를 메모이제이션해서 불필요한 재렌더링 방지
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; //서버와 통신할 때 HTTP 요청(GET, POST 등)을 보내는 라이브러리입니다.
import "./WorkDetail.css";

import SearchBar from "../../../components/layout/SearchBar";

//export default: 다른 파일에서 이 컴포넌트를 불러 쓸 수 있게 내보냅니다.
export default function WorkList() {

  const [searchInput, setSearchInput] = useState(""); //검색어
  const [workList, setWorkList] = useState([]); //검색 목록
  const [loading, setLoading] = useState(false); //로딩
  
  const [editMode, setEditMode] = useState(false); // 🔹 전체 수정 모드 여부
  const [newRows, setNewRows] = useState([]);// 새로 추가한 행들



//검색
//useCallback 불필요한 재렌더링 방지, ESLint 경고 방지
//async/await axios 요청이 비동기라서, 응답이 올 때까지 기다리도록 함
const getWorkList = useCallback(async () => {
    try {
      setLoading(true); //로딩표시

      //서버호출
      const res = await axios.get("/api/work/list", {
        params: { keyword: searchInput },
      });
      console.log("data:", res.data);
      setWorkList(res.data); //받아온 데이터를 workList 상태에 저장
      return res; //결과 반환
    } catch (err) {
      console.error("검색 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [searchInput]); // 최신 검색어 반영



  // ✅ 페이지 최초 진입 시 목록 조회
  // [getWorkList] 이 함수가 바뀌면 다시 실행됩니다. (React가 권장하는 안전한 방식)
  useEffect(() => {
    getWorkList();
  }, [getWorkList]); // ESLint 경고 없음

  // ✅ 검색 버튼 클릭 시 실행
  const handleSearchClick = () => {
    getWorkList();
  };

 //추후 데이터로 받아올것.
  const fields = [
    { key: "workTitle", label: "제목", type: "text" },
    { key: "workRequester", label: "요청자", type: "text" },
    
    { key: "workExpectedStartDate", label: "예정시작", type: "date" },
    { key: "workExpectedEndDate", label: "예정종료", type: "date" },
    { key: "workProgressStartDate", label: "진행시작", type: "date" },
    { key: "workProgressEndDate", label: "진행종료", type: "date" },
    { key: "workSituation", label: "상태", type: "text" },
    { key: "workContents", label: "내용", type: "text" },
    { key: "workEtc", label: "비고", type: "text" },
  ];



  // 수정 중 값 변경
  const handleChange = (index, field, value) => {
    const updated = [...workList];
    updated[index][field] = value;
    setWorkList(updated);
  };


  // 새 행 추가
  const handleAddRow = () => {

     // 새 행 기본 구조 자동 생성
    const emptyRow = fields.reduce((acc, f) => {
      acc[f.key] = ""; // 각 key에 빈 문자열 값 설정
      return acc;
    }, {}); // 빈 객체에서 시작

    setNewRows([ ...newRows,emptyRow ]);
  };


  // 새 행 값 변경
  //React의 상태(state)는 불변성(immutability) 을 유지해야 합니다. 즉, 기존 배열이나 객체를 직접 수정하면 안 되고, 항상 “복사본을 만들어서 수정 → 다시 setState()” 해야 합니다.
  //1️⃣ const updated = [...newRows] → 배열 복사
  //2️⃣ updated[index][field] = value → 해당 행의 특정 필드값만 수정
  //3️⃣ setNewRows(updated) → 새로운 배열로 상태 갱신
  const handleNewChange = (index, field, value) => {
    const updated = [...newRows];
    updated[index][field] = value;
    setNewRows(updated);
  };

  // 전체 저장
  const handleSaveAll = async () => {
    
    const payload = {
        updatedList: editMode ? workList : [], // 수정모드일 때만 보냄
        newList: newRows, // 신규 입력된 행
      };

    /*
    if(!editMode){ //수정모드 라면
      payload = payload.concat(workList); //payload = [...payload, ...workList];
    }
    */

  try {
    await axios.post("/api/work/saveAll", payload);

    alert("저장되었습니다!");
    setEditMode(null); //수정중인행
    setNewRows([]); 

    await getWorkList(); // 🔹 단순히 재조회만
  } catch (err) {
    console.error("저장 오류:", err);
  }
};


// ✅ 새 행 삭제 함수
const handleDeleteNewRow = (index) => {
  //배열에서 특정 인덱스(index)의 요소를 제외한 나머지만 남기는 코드
  //filter 콜백의 두 번째 매개변수 i는 인덱스(index)이고, _는 현재 값인데 안 쓸 때 _로 표시하는 관례예요
  const updated = newRows.filter((_, i) => i !== index);  //filter false 면 남김
  setNewRows(updated);
};


// DB 데이터 삭제
//행위	HTTP 메서드	URL 예시	의미
//조회	GET	/api/work/1	id가 1인 Work 조회
//등록	POST	/api/work	새로운 Work 생성
//수정	PUT / PATCH	/api/work/1	id가 1인 Work 수정
//삭제	DELETE	/api/work/1	id가 1인 Work 삭제
const workListDelete = async (id) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;

  try {
    await axios.delete(`/api/work/${id}`); // DELETE 요청으로 ID 전달
    alert("삭제되었습니다!");
    await getWorkList(); // 리스트 다시 불러오기
  } catch (err) {
    console.error("삭제 오류:", err);
    alert("삭제 중 오류가 발생했습니다.");
  }
};



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
        <button onClick={handleAddRow}>+ 행 추가_</button>
        <button onClick={() => setEditMode(!editMode)} style={{ marginLeft: "8px" }}>
          ✏️ {editMode ? "보기모드" : "수정모드"}
        </button>
        <button onClick={handleSaveAll} style={{ marginLeft: "8px" }}>
          💾 저장
        </button>
      </div>

      {/* 테이블 컨테이너 */}
      <table className="work-table">
        <thead>
          <tr style={{ background: "#dfe6e9", fontWeight: "bold" }}>
            {/* 컬럼 헤더 */}
            {fields.map((f) => (
              <th key={f.key}>{f.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* 기존 목록 */}
          {workList.map((work, index) => (
            <tr key={work.workPk}>
              {fields.map((f) => (
                <td key={f.key}>
                  {editMode ? (
                    <input
                      type={f.type}
                      className="input-box"
                      value={work[f.key] || ""}
                      onChange={(e) => handleChange(index, f.key, e.target.value)}
                    />
                  ) : (
                    work[f.key] || "-"
                  )}
                </td>
              ))}
              <td>
                <button style={{ color: "red" }} onClick={() => workListDelete(work.workPk)}>삭제</button>
              </td>
            </tr>
          ))}

          {/* 신규 추가 입력행 */}
          {newRows.map((row, index) => (
            <tr key={`new-${index}`} className="new-row">
              {fields.map((f) => (
                <td key={f.key}>
                  <input
                    type={f.type}
                    className="input-box"
                    placeholder={f.label}
                    value={row[f.key] || ""}
                    onChange={(e) => handleNewChange(index, f.key, e.target.value)}
                  />
                </td>
              ))}
              <td>
                {/*
                onClick={handleEdit(index)}처럼 쓰면, 렌더링 시점에 실행돼버리기 때문이에요.
                그래서 () => handleEdit(index) 처럼 “눌렀을 때 실행”하도록 감싸주는 거예요.
                */}
                <button style={{ color: "red" }} onClick={() => handleDeleteNewRow(index)}>삭제</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>


      
    </div>
  );
}
