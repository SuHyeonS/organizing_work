
// ✅ 이 슬라이스를 사용하는 컴포넌트
//기능에 대한 UI

import { useSelector, useDispatch } from 'react-redux';
import { increment } from './counterSlice';

export default function Counter() {
  const count = useSelector((state) => state.counter.value); //Redux에서 현재 상태값을 가져오는 함수
  const dispatch = useDispatch(); //Redux에게 "버튼 눌렸어!"라고 알리는 함수?

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>+1</button> {/*숫자 증가 액션?*/}
    </div>
  );
}
