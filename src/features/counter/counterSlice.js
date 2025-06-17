// ✅ Redux 슬라이스 (상태 + reducer 함수)
//기능부분

import { createSlice } from '@reduxjs/toolkit'; //Redux Toolkit이 제공하는 쉬운 상태 생성 도구

const initialState = { value: 0 }; //초기화

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => { state.value += 1; }, //increment: 버튼 누르면 +1 하도록 정의된 액션 함수
    decrement: state => { state.value -= 1; },  
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;