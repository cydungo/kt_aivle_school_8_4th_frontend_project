import React, { useState } from "react";
import "./rgtpage.css";

export default function RgtPage() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div className="register-container">
            {/* 상단 배너 */}
            <div className="register-banner">
                <h2>신규 도서 등록</h2>
                <p>새로운 도서 정보 입력</p>
            </div>

            {/* 본문 */}
            <div className="register-box">

                {/* 이미지 업로드 영역 */}
                <div className="image-area">
                    작품이미지
                </div>

                {/* 입력 영역 */}
                <div className="input-area">

                    <label className="label">도서 제목</label>
                    <input
                        type="text"
                        className="input-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="label">도서 설명</label>
                    <textarea
                        className="input-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="btn-area">
                <button className="cancel-btn">취소</button>
                <button className="submit-btn">등록</button>
            </div>
        </div>
    );
}
