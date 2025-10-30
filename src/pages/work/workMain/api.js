

// 실제 서버 연결 시 이걸 활성화하세요.
// const api = axios.create({ baseURL: "/api" });

// Mock용 예시 (백엔드 없이도 동작)
const mockWorks = [
  { workPk: 1, title: "프로젝트 기획", owner: "홍길동", status: "진행중" },
  { workPk: 2, title: "데이터 분석", owner: "이몽룡", status: "대기중" },
];

export const api = {
  get: async (url, opts) => {
    if (url === "/work/meta") {
      return {
        data: [
          { key: "workPk", label: "번호", type: "text" },
          { key: "title", label: "업무명", type: "text" },
          { key: "owner", label: "담당자", type: "text" },
          { key: "status", label: "상태", type: "text" },
        ],
      };
    }
    if (url === "/work") {
      return { data: mockWorks };
    }
    if (url.startsWith("/work/subList")) {
      return {
        data: [
          { subPk: 101, subTitle: "하위 업무 1" },
          { subPk: 102, subTitle: "하위 업무 2" },
        ],
      };
    }
    return { data: [] };
  },
  post: async (url, data) => {
    console.log("POST", url, data);
    alert("저장 완료!");
    return { data: { success: true } };
  },
  delete: async (url) => {
    console.log("DELETE", url);
    alert("삭제 완료!");
    return { data: { success: true } };
  },
};
