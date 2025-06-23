
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  username: '',
  isInitialized: false
};

//sessionStorage 대신 localStorage 사용 → 새로고침 후에도 로그인 상태 유지
//Redux 초기화 지연 문제 해결을 위해 isInitialized 도입 → 상태 복원 후 렌더링
//로그아웃 시 localStorage 제거로 상태 초기화

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload;
      state.isInitialized = true;
      localStorage.setItem('auth', JSON.stringify({ isLoggedIn: true, username: action.payload }));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = '';
      state.isInitialized = true;
      localStorage.removeItem('auth');
    },
    initialize: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.username = action.payload.username;
      state.isInitialized = true;
    }
  }
});

export const { login, logout, initialize } = authSlice.actions;
export default authSlice.reducer;
