import React, { useEffect, useState } from "react";
import axios from "axios";

function Business() {
  const [business, setBusiness] = useState([]); // 배열로 관리
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/business/list") // 리스트 API 호출
      .then((res) => {
        console.log('data : ',res.data);
        setBusiness(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API 호출 오류:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>사업목록</h1>
      {business.length === 0 ? (
        <p>조회결과가 없습니다.</p>
      ) : (
        <ul>
          {business.map((value) => (
            <li key={value.testPk}>
              ID: {value.businessPk}, 지역: {value.businessArea}, 사업명: {value.businessName}, 사업구분: {value.businessType}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Business;
