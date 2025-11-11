
import { createSlice } from '@reduxjs/toolkit';

//로그인 정보 저장

const initialState = {
  isLoggedIn: false, //로그인상태
  user: null, // 전체 user 객체 저장
  isInitialized: false //Redux 상태 초기화 여부를 나타냄 (앱이 시작될 때 localStorage 복원 완료 후 true
};

//sessionStorage 대신 localStorage 사용 → 새로고침 후에도 로그인 상태 유지
//Redux 초기화 지연 문제 해결을 위해 isInitialized 도입 → 상태 복원 후 렌더링
//로그아웃 시 localStorage 제거로 상태 초기화

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => { //로그인
      state.isLoggedIn = true;
      state.user = action.payload; // 전체 user 객체 저장
      state.isInitialized = true;
      localStorage.setItem('auth', JSON.stringify({ isLoggedIn: true, user: action.payload }));
    },
    logout: (state) => { //로그아웃
      state.isLoggedIn = false;
      state.user = null;
      state.isInitialized = true;
      localStorage.removeItem('auth');
    },
    initialize: (state, action) => { //앱 시작 시 localStorage에서 상태를 복원할 때 호출
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user || null;
      state.isInitialized = true;
    }
  }
});

export const { login, logout, initialize } = authSlice.actions;
export default authSlice.reducer;
