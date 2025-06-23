import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

function Baa() {
  const [companyCount, setCompanyCount] = useState(1);
  const [formData, setFormData] = useState({
    project_name: "",
    contractors: "",
    contract_price: "",
    contract_date: "",
    expected_date: "",
    half_date: "",
    half_price: "",
    report_date: "",
    task1: "", // 전체 유지보수 내역을 한 번에 입력
    company1: "",
    ceo1: "",
    company2: "",
    ceo2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateDoc = async () => {
    try {
      const response = await fetch("/template/docx/template.docx");
      if (!response.ok) throw new Error("템플릿 로딩 실패");

      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true, // 줄바꿈 유지
      });

      doc.setData({
        ...formData,
        showCompany2: companyCount === 2,
      });

      try {
        doc.render();
      } catch (e) {
        console.error(e);
        alert("문서 생성 실패");
        return;
      }

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, "완료서_자동생성.docx");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>완료서 자동 생성</h2>

      <div style={{ marginBottom: 10 }}>
        <strong>✔ 업체 수 선택:</strong>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="companyCount"
            value={1}
            checked={companyCount === 1}
            onChange={() => setCompanyCount(1)}
          />
          1개
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="companyCount"
            value={2}
            checked={companyCount === 2}
            onChange={() => setCompanyCount(2)}
          />
          2개
        </label>
      </div>

      {[
        ["project_name", "건 명"],
        ["contractors", "용역기관"],
        ["contract_price", "계약금액"],
        ["contract_date", "계약일"],
        ["expected_date", "준공예정일"],
        ["half_date", "반기준공일"],
        ["half_price", "반기준공금"],
        ["report_date", "작성일자"],
        ["company1", "업체명1"],
        ["ceo1", "대표자1"],
        ...(companyCount === 2
          ? [
              ["company2", "업체명2"],
              ["ceo2", "대표자2"],
            ]
          : []),
      ].map(([name, label]) => (
        <div key={name} style={{ marginBottom: 8 }}>
          <label style={{ width: 130, display: "inline-block" }}>{label}: </label>
          <input
            name={name}
            value={formData[name]}
            onChange={handleChange}
            style={{ width: 300 }}
          />
        </div>
      ))}

      <div style={{ marginBottom: 12 }}>
        <label style={{ width: 130, display: "inline-block", verticalAlign: "top" }}>
          유지보수 내역:
        </label>
        <textarea
          name="task1"
          value={formData.task1}
          onChange={handleChange}
          style={{ width: 400, height: 160 }}
        />
      </div>

      <button onClick={generateDoc} style={{ marginTop: 12 }}>
        완료서 다운로드
      </button>
    </div>
  );
}

export default Baa;
