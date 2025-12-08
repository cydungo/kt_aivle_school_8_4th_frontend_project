import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/NewBookPage.css";
import "../styles/RevisePage.css";

export default function RevisePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const formatDate = (dateString) => {
        if (!dateString) return "정보 없음";
        // "2025-12-05T17:03:53.750913" → "2025-12-05 17:03:53"
        return dateString.split('.')[0].replace('T', ' ');
    };
    // location.state로 전달받은 데이터 또는 기본값
    const bookData = location.state?.book;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [ImageURL, setImageURL] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                // location.state에 데이터가 있으면 그것을 사용
                if (bookData) {
                    setTitle(bookData.title || "");
                    setContent(bookData.content || "");
                    setImageURL(bookData.image || "");
                    setCreatedAt(bookData.createdAt || "");
                    setUpdatedAt(bookData.updatedAt || "");
                    setLoading(false);
                }
                // 없으면 API에서 다시 가져오기
                else if (id) {
                    const response = await axios.get(`http://localhost:8080/api/books/${id}`);
                    const data = response.data;
                    setTitle(data.title || "");
                    setContent(data.content || "");
                    setImageURL(data.image || "");
                    setCreatedAt(data.createdAt || "");
                    setUpdatedAt(data.updatedAt || "");
                    setLoading(false);
                }
            } catch (error) {
                console.error("도서 정보를 불러오는데 실패했습니다:", error);
                alert("도서 정보를 불러올 수 없습니다.");
                navigate(-1);
            }
        };

        fetchBookData();
    }, [id, bookData, navigate]);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/api/books/${id}`, {
                title,
                content
            });
            alert("수정이 완료되었습니다.");
            navigate(`/detail/${id}`);
        } catch (error) {
            console.error("수정 실패:", error);
            alert("수정에 실패했습니다.");
        }
    };

    if (loading) {
        return <div className="register-container">로딩중...</div>;
    }

    return (
        <div className="detail-wrapper">
            <div className="detail-header">도서 정보 수정</div>

            {/* 본문 박스 */}
            <div className="register-box">
                <div className="detail-left">
                    {ImageURL ? (
                        <img src={ImageURL} alt="작품 이미지" className="detail-img"/>
                    ) : (
                        "이미지 영역 (추후 업로드 기능 추가)"
                    )}
                </div>

                {/* 입력 영역 */}
                <div className="input-area">
                    <label className="label">도서 제목 (수정)</label>
                    <input
                        type="text"
                        className="input-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="label" style={{ marginTop: "20px" }}>
                        도서 설명 (수정)
                    </label>
                    <textarea
                        className="input-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                </div>
            </div>
            {/* 등록일 / 수정일 */}

            {/* 등록일 / 수정일 표시 */}
            <div className="detail-info-footer">


                <div>등록일: {formatDate(createdAt)}</div>
                <div>수정일: {formatDate(updatedAt)}</div>

            </div>
            {/* 버튼 영역 */}
            <div className="btn-area">
                <button className="cancel-btn" onClick={handleCancel}>취소</button>
                <button className="submit-btn" onClick={handleSubmit}>수정 완료</button>
            </div>
        </div>
    );
}