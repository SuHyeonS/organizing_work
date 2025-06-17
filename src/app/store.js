
// ✅ Redux 전역 상태 저장소 설정

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

//configureStore(): Redux의 중앙 상태 저장소 만들기
//앱 전역에서 사용할 상태(state)를 만들고 등록하는 곳
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});