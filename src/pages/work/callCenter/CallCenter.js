/*
import React from 'react';

export default function Abb() {
  return (
    <div>
      <h2>Abb Page</h2>
      <p>This is the Abb page.</p>
    </div>
  );
}
*/

import React, { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

//HwpGenerator
export default function Abb() {
  const [projectName, setProjectName] = useState("");
  const [contractor, setContractor] = useState("");

  const generateDocument = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "완료서", bold: true, size: 32 })],
              alignment: "center",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun(`1. 건명: ${projectName}`)],
            }),
            new Paragraph({
              children: [new TextRun(`2. 용역기관: ${contractor}`)],
            }),
            new Paragraph({
              children: [new TextRun("3. 계약금액: 금 삼백만원 (₩3,000,000)")],
            }),
            new Paragraph({
              children: [new TextRun("...이하 생략 가능...")],
            }),
            new Paragraph({ children: [new TextRun("이상과 같이 유지보수를 완료하였습니다.")] }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "완료서.docx");
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>완료서 생성기</h2>
      <div>
        <label>건명 (프로젝트명): </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div>
        <label>용역기관: </label>
        <input
          type="text"
          value={contractor}
          onChange={(e) => setContractor(e.target.value)}
        />
      </div>
      <button onClick={generateDocument} style={{ marginTop: 10 }}>
        한글파일 다운로드
      </button>
    </div>
  );
}
