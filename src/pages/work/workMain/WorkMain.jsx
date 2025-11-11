
//훅 
//useState: 상태(state) 관리
//useEffect: 컴포넌트가 처음 실행되거나 특정 값이 바뀔 때 동작
//useCallback: 함수를 메모이제이션해서 불필요한 재렌더링 방지
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios"; //서버와 통신할 때 HTTP 요청(GET, POST 등)을 보내는 라이브러리입니다.

import { useSelector } from 'react-redux'; //로그인한 user 정보

import "./WorkMain.css";

import SearchBar from "../../../components/layout/SearchBar";
import WorkModal from "./WorkModal";

//export default: 다른 파일에서 이 컴포넌트를 불러 쓸 수 있게 내보냅니다.
export default function WorkMain() {


  //목록
  const [workList, setWorkList] = useState([]); //검색 목록
  const [editMode, setEditMode] = useState(false); // 🔹 전체 수정 모드 여부
  const [newRows, setNewRows] = useState([]);// 새로 추가한 행들

  //테이블구조
  const [fields, setFields] = useState([]); 

  //모달
  const [showDetailModal, setShowDetailModal] = useState(false); // 모달 열림 여부
  const [selectedWork, setSelectedWork] = useState(null);        // 클릭한 Work 객체

  //필드 기본값
  //Redux store에서 로그인한 user 정보 가져오기
  const { user, isLoggedIn } = useSelector(state => state.auth);
  const [selectBox, setSelectBox] = useState([]); //요청자, 수행자
  const [selInput, setSelInput] = useState([]); //진행상태, 업무구분, 업무종류

  const [searchInput, setSearchInput] = useState(""); //검색어
  const [loading, setLoading] = useState(false); //로딩


  //검색
  //useCallback 불필요한 재렌더링 방지, ESLint 경고 방지
  //async/await axios 요청이 비동기라서, 응답이 올 때까지 기다리도록 함
  const getWorkList = useCallback(async () => {
    try {
      setLoading(true); //로딩표시

      //서버호출
      const res = await axios.get("/api/work", {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // getWorkList ESLint 경고 없음 > ✅ 최초 1회만 조회

  // ✅ 검색 버튼 클릭 시 실행
  const handleSearchClick = () => {
    getWorkList();
  };

  //필드설정
  const fetchFields = useCallback(async () => {
    const tableName = "work";
    const schemaName = "public";

    try {
      setLoading(true);
      const res = await axios.get(`/api/work/meta`, {
        params: { schemaName, tableName }
      });

      console.log("DDL data : ", res.data);

      const mappedFields = res.data

      fetchFieldValues(mappedFields);
      //.filter(col => col.key && col.label) // key/label 없는 항목 제거
      /*
      .map(col => ({
        key: col.key,
        label: col.label || col.key,
        type: col.type
      }));
      */
      //console.log("DDL mappedFields : ", mappedFields);

      setFields(mappedFields);
    } catch (err) {
      console.error("컬럼 정보 로딩 실패", err);
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열이 빈 배열이면 fetchFields는 항상 같은 함수

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

//필드값
const fetchFieldValues = useCallback(async (mappedFields) => {
    
    try {
      //setLoading(true);

      let fields={};
      if(!mappedFields){
        const tableName = "work";
        const schemaName = "public";

        const res = await axios.get(`/api/work/meta`, {
          params: { schemaName, tableName }
        });
        fields = res.data;
      }else{
        fields = mappedFields
      }

      //fields = res.data;

      // selectBox용, selInput용 객체 초기화
      const selectBoxData = {};
      const selInputData = {};

      // options가 있는 필드만 추출해서 key 기준으로 객체화
      fields.forEach((f) => {
        if (f.options && f.options.length > 0) {
          if (f.type === "select") {
            selectBoxData[f.key] = { options: f.options };
          } else if (f.type === "selInput") {
            selInputData[f.key] = { options: f.options };
          }
        }
      });

      console.log("옵션 필드 객체:", selectBoxData, selInputData);

      // 상태 업데이트
      setSelectBox(selectBoxData); //요청자, 수행자
      setSelInput(selInputData); //진행상태, 업무구분, 업무종류
      
    } catch (err) {
      console.error("컬럼 정보 로딩 실패", err);
    } finally {
      //setLoading(false);
    }
  }, []); // 의존성 배열이 빈 배열이면 fetchFields는 항상 같은 함수



  /*
 //추후 데이터로 받아올것.
  const fields = [
    { key: "workTitle", label: "제목", type: "text" },
    { key: "workRequestDate", label: "요청일", type: "date" },
    { key: "workRequester", label: "요청자", type: "text" },
    { key: "workPerformer", label: "수행자", type: "text" },
    { key: "workCompletionDate", label: "완료일", type: "date" },
    { key: "workContents", label: "내용", type: "text" },
    { key: "workSituation", label: "진행 상태", type: "text" },
    { key: "workType", label: "업무구분", type: "text" },
    { key: "workAssortment", label: "업무종류", type: "text" },
    { key: "workEtc", label: "비고", type: "text" },
  ];
*/


  // 수정 중 값 변경
  const handleChange = (index, field, value) => {
    const updated = [...workList];
    updated[index][field] = value;
    setWorkList(updated);
  };


  // 새 행 추가
  const handleAddRow = () => {
    fetchFieldValues(); //select 박스 갱신

     // 새 행 기본 구조 자동 생성
    const emptyRow = fields.reduce((acc, f) => {

      //acc 누적값
      //f 현재값

      //console.log("????", acc, f);
      acc[f.key] = ""; // 각 key에 빈 문자열 값 설정

      // 각 key에 ""빈 문자열 값 설정
      if(f.key === "workRequestDate"){
          acc[f.key] = TodayDate();
      }
        
      if(f.key === "workPerformerSituation"){
          acc[f.key] = user.usersName;
      }

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
    console.log("전체 저장 : ",newRows);
    const payload = {
        //workPk: {workPk:work.workPk}, // 🔹 부모 workPk 전달 > parent 객체 구조로 전달
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
    setNewRows([]);  //초기화
    setEditMode(false); //수정중인행
    getWorkList(); //갱신
    //await getWorkList(); // 🔹 단순히 재조회만
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
    if (!window.confirm("정말 삭제하시겠습니까? \n하위목록까지 같이 삭제됩니다.")) return;

    try {
      await axios.delete(`/api/work/${id}`); // DELETE 요청으로 ID 전달
      alert("삭제되었습니다!");
      await getWorkList(); // 리스트 다시 불러오기
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  


  //하위목록이동
  //saveCheckList = []; //체크한 목록
  const saveCheckList = useRef([]);//체크한 목록
  // 체크박스 키 저장
  const handleCheck = (id) => {
    if (!saveCheckList.current.includes(id)) {
      saveCheckList.current.push(id);
    }
  };
  const moveSublist = async (id) => {
    if (!window.confirm("체크한 목록을 해당목록의 하위로 이동하시겠습니까? ")) return;
    
    console.log("모달 체크박스 확인 moveSublist : ", saveCheckList);
    if(!saveCheckList.current || saveCheckList.current.length === 0){
      alert("체크된 목록이 없습니다!");
      return;
    }
    const payload = {
        subList: saveCheckList.current, // 이관할 키 목록 > useRef 사용시 current 필수!
        workPk: id, // 이관받을 키
      };
    
    try {
      var mge = await axios.put(`/api/work/${id}/moveChildren`, payload);
      alert(mge.data);
      await getWorkList(); // 리스트 다시 불러오기
    } catch (err) {
      console.error("이관 오류:", err);
      alert("이관 중 오류가 발생했습니다.");
    }
      
  };

  //모달 on
  const openModal = (key, check) => {
    setSelectedWork(key);
    setShowDetailModal(check);
  }; 

  //모달 종료시 목록 갱신
  const onCloseModal = () => {
    getWorkList();
    setShowDetailModal(false);
  };

  function TodayDate() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    //return <div>오늘 날짜: {today}</div>;
    return today;
  }


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
            <th style={{ width: `${100 / (fields.length+4)}%` }}>하위</th>
            {fields.length > 0 ? fields.map(f => {
               //console.log("컬럼 헤더 : ",f.key," : ",f.label)
               return <th style={{ width: `${100 / (fields.length+4)}%` }} key={f.key}>{f.label}</th>; //체크,상세,하위,삭제
            }) : <th>Loading...</th>}
            {/*
            {fields.map((f) => (
              <th key={f.key}>{f.label}</th>
            ))}
            */}
            <th style={{ width: `${100 / (fields.length+4)}%` }}>상세목록</th>
            <th style={{ width: `${100 / (fields.length+4)}%` }}>하위이동</th>
            <th style={{ width: `${100 / (fields.length+4)}%` }}>삭제</th>
          </tr>
        </thead>

        <tbody>
          {/* 기존 목록 */}
          {workList.length > 0 && fields.length > 0 ? (
            workList.map((work, index) => (
            <tr key={work.workPk}>
              <td>
                <input type="checkbox" className="input-check" onClick={() => handleCheck(work)}/>
              </td>
              {fields.map((f) => (
                <td key={f.key}>
                  
                  {editMode ? (
                    <>
                      {f.type === "select" ? (
                        // 일반 select
                        <select
                          className="input-box"
                          value={work[f.key] || ""}
                          onChange={(e) => handleChange(index, f.key, e.target.value)}
                        >
                          <option value="">선택</option>
                          {(selectBox[f.key]?.options || []).map((opt, i) => (
                            <option key={i} value={opt.value || opt}>
                              {opt.label || opt}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "selInput" ? (
                        // ✅ input + datalist (입력 + 자동완성 + 선택 가능)
                        <>
                          <input
                            type="text"
                            className="input-box"
                            list={`${f.key}-list`}
                            placeholder={f.label}
                            value={work[f.key] || ""}
                            onChange={(e) => handleChange(index, f.key, e.target.value)}
                          />
                          <datalist id={`${f.key}-list`}>
                            {(selInput[f.key]?.options || []).map((opt, i) => (
                              <option key={i} value={opt.value || opt}>
                                {opt.label || opt}
                              </option>
                            ))}
                          </datalist>
                        </>
                      ) : (
                        // 기본 text/date
                        <input
                          type={f.type}
                          className="input-box"
                          value={work[f.key] || ""}
                          onChange={(e) => handleChange(index, f.key, e.target.value)}
                        />
                      )}
                    </>

                  ) : (
                    work[f.key] || "-"
                  )}
                </td>
              ))}
              <td onClick={() => openModal(work.workPk, true)} style={{ cursor: "pointer", color: "blue" }}>상세</td>
              <td>
                <button style={{ color: "blue" }} onClick={() => moveSublist(work.workPk)}>하위이동</button>
              </td>
              <td>
                <button style={{ color: "red" }} onClick={() => workListDelete(work.workPk)}>삭제</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={fields.length}>데이터가 없습니다.</td>
          </tr>
        )}

          {/* 신규 추가 입력행 */}
          {newRows.map((row, index) => (
            <tr key={`new-${index}`} className="new-row">
              <td>{/* 비워둠 */}</td>
              {fields.map((f) => (
                <td key={f.key}>
                  {f.type === "select" ? (
                    // 일반 select
                    <select
                      className="input-box"
                      value={row[f.key] || ""}
                      onChange={(e) => handleNewChange(index, f.key, e.target.value)}
                    >
                      <option value="">선택</option>
                      {(selectBox[f.key]?.options || []).map((opt, i) => (
                        <option key={i} value={opt.value || opt}>
                          {opt.label || opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "selInput" ? (
                    // ✅ input + datalist (입력 + 자동완성 + 선택 가능)
                    <>
                      <input
                        type="text"
                        className="input-box"
                        list={`${f.key}-list`}
                        placeholder={f.label}
                        value={row[f.key]||""}
                        onChange={(e) => handleNewChange(index, f.key, e.target.value)}
                      />
                      <datalist id={`${f.key}-list`}>
                        {(selInput[f.key]?.options || []).map((opt, i) => (
                          <option key={i} value={opt.value || opt}>
                            {opt.label || opt}
                          </option>
                        ))}
                      </datalist>
                    </>
                  ) : (
                    // 기본 text/date
                    <input
                      type={f.type}
                      className="input-box"
                      placeholder={f.label}
                      value={row[f.key] || ""}
                      onChange={(e) => handleNewChange(index, f.key, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>{/*삭제칸을 위하 */}</td> 
              <td>{/*삭제칸을 위하 */}</td>
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
      
      {/* 상세 모달 */}
      {showDetailModal && selectedWork && (
        <WorkModal
          fields={fields} //필드
          workPk={selectedWork} //선택자
          onClose={ onCloseModal}
          moveProps={{handleCheck, moveSublist, saveCheckList}}
          inserLow={{TodayDate, user, fetchFieldValues, selectBox, selInput}}
        />
      )}
      
    </div>
  );
}
