

//훅 
//useState: 상태(state) 관리
//useEffect: 컴포넌트가 처음 실행되거나 특정 값이 바뀔 때 동작
//useCallback: 함수를 메모이제이션해서 불필요한 재렌더링 방지
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; //서버와 통신할 때 HTTP 요청(GET, POST 등)을 보내는 라이브러리입니다.
import "./WorkList.css";
import "./WorkListDetail.css"; // 모달 스타일

import SearchBar from "../../../components/layout/SearchBar";

//export default: 다른 파일에서 이 컴포넌트를 불러 쓸 수 있게 내보냅니다.
export default function WorkListDetail({ work, onClose }) {
  

    const [searchInput, setSearchInput] = useState(""); //검색어
    const [workList, setWorkList] = useState(work.subList || []); // ✅ 이미 부모에서 받은 리스트
    const [loading, setLoading] = useState(false); //로딩

    const [editMode, setEditMode] = useState(false); // 🔹 전체 수정 모드 여부
    const [newRows, setNewRows] = useState([]);// 새로 추가한 행들

    const [showDetailModal, setShowDetailModal] = useState(false); // 모달 열림 여부
    const [selectedWork, setSelectedWork] = useState(null);        // 클릭한 Work 객체

    const [fields, setFields] = useState([]); //테이블구조

    //검색
    //useCallback 불필요한 재렌더링 방지, ESLint 경고 방지
    //async/await axios 요청이 비동기라서, 응답이 올 때까지 기다리도록 함
    const getWorkListDetail = useCallback(async () => {
    //const getWorkListDetail = async (workPk) => {

        console.log("work.workPk : ", work.workPk);
        try {
        setLoading(true); //로딩표시

        //서버호출
        const res = await axios.get("/api/work/subList", {
            params: { keyword: searchInput, workPk:work.workPk },
        });
        console.log("data:", res.data);
        setWorkList(res.data); //받아온 데이터를 workList 상태에 저장
        return res; //결과 반환
        } catch (err) {
        console.error("검색 오류:", err);
        } finally {
        setLoading(false);
        }
    }, [searchInput, work.workPk]); // 최신 검색어 반영


    const handleDetail = async (workPk) => {
        try {
            setLoading(true);

            // 상세 + 하위 리스트를 동시에 요청
            const [detailRes, subListRes] = await Promise.all([
            axios.get(`/api/work/one?workPk=${workPk}`),
            axios.get(`/api/work/subList?workPk=${workPk}`)
            ]);

            // 결과를 한 번에 세팅
            setSelectedWork({
            ...detailRes.data,
            subList: subListRes.data
            });

            // 모든 데이터 준비 후 모달 열기
            setShowDetailModal(true);
        } catch (err) {
            console.error("상세 조회 오류:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 검색 버튼 클릭 시 실행
    const handleSearchClick = () => {
        getWorkListDetail();
    };

    const mapDataTypeToFieldType = (dataType) => {
        if (!dataType) return "text";
        if (dataType.includes("date") || dataType.includes("timestamp")) return "date";
        if (dataType.includes("int") || dataType.includes("number")) return "number";
        return "text";
    };
        
    const fetchFields = useCallback(async () => {
        const tableName = "work";
        const schemaName = "public";

        try {
        setLoading(true);
        const res = await axios.get(`/api/work/${tableName}`, {
            params: { tableName, schemaName }
        });

        console.log("DDL data : ", res.data);

        const mappedFields = res.data
        .filter(col => col.key && col.label) // key/label 없는 항목 제거
        .map(col => ({
            key: col.key,
            label: col.label || col.key,
            type: mapDataTypeToFieldType(col.type)
        }));

        console.log("DDL mappedFields : ", mappedFields);

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

  /*
    //추후 데이터로 받아올것.
      const fields = [
        { key: "workTitle", label: "제목", type: "text" },
        { key: "workRequestDate", label: "요청일", type: "date" },
        { key: "workRequester", label: "요청자", type: "text" },
        { key: "workPerformer", label: "수행자", type: "text" },
        { key: "workCompletionDate", label: "완료일", type: "date" },
        { key: "workContents", label: "내용", type: "text" },
        { key: "workSituation", label: "진행 상태", type: "sel" },
        { key: "workType", label: "업무구분", type: "text" },
        { key: "workAssortment", label: "업무종류", type: "text" },
        { key: "workEtc", label: "비고", type: "text" },

        { key: "workExpectedStartDate", label: "예정일시작", type: "date" },
        { key: "workExpectedEndDate", label: "예정일종료", type: "date" },
        { key: "workProgressStartDate", label: "진행일시작", type: "date" },
        { key: "workProgressEndDate", label: "진행일종료", type: "date" },
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

        // 새 행 기본 구조 자동 생성
        //fields.reduce()는 fields 배열을 돌면서 누적 객체(acc) 를 만듬
        const emptyRow = fields.reduce((acc, f) => {
        acc[f.key] = ""; // 각 key에 빈 문자열 값 설정
        return acc;
        }, { parent: { workPk: work.workPk }}); // 초기값 셋팅

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
            parent: {workPk:work.workPk}, // 🔹 부모 workPk 전달 > parent 객체 구조로 전달
            updatedList: editMode ? workList : [], // 수정모드일 때만 보냄
            newList: newRows, // 신규 입력된 행
        };

        console.log("call.. handleSaveAll : ", payload);
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

        await getWorkListDetail(); // 🔹 단순히 재조회만
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
        await getWorkListDetail(); // 리스트 다시 불러오기
    } catch (err) {
        console.error("삭제 오류:", err);
        alert("삭제 중 오류가 발생했습니다.");
    }
    };


    if (!work) return null; // work가 없으면 렌더링 안 함

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* 좌측 */}
                <div className="modal-left">
                    <h2>상세 정보</h2>
                    {fields.map((f) => (
                        <p><strong>{f.label}:</strong> {work[f.key] || ""}</p>
                    ))}
                    <button onClick={onClose}>닫기</button>
                </div>

                {/* 우측 */}
                <div className="modal-right">
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
                        <table className="work-table" style={{ width: "90%" }}>
                            <thead>
                            <tr style={{ background: "#dfe6e9", fontWeight: "bold"}}>
                                {/* 컬럼 헤더 */}
                                {fields.map((f) => (
                                <th style={{ width: `${100 / (fields.length+2)}%` }} key={f.key}>{f.label}</th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            {/* 기존 목록 */}
                            {workList.length > 0 && fields.length > 0 ? (
                                workList.map((work, index) => (
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
                                <td onClick={() => handleDetail(work.workPk)} style={{ cursor: "pointer", color: "blue" }}>상세</td>
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
                                <input type="hidden" value={work.workPk} name="parentWorkPk" />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 상세 모달 */}
            {showDetailModal && selectedWork && (
                <WorkListDetail
                    work={selectedWork}
                    onClose={() => setShowDetailModal(false)}
                />
            )}

        </div>
    );
}
