
// ✅ Redux 전역 상태 저장소 설정

import { configureStore } from '@reduxjs/toolkit';

//configureStore(): Redux의 중앙 상태 저장소 만들기
//앱 전역에서 사용할 상태(state)를 만들고 등록하는 곳

import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

export default store;
