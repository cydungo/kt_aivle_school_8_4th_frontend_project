import React from "react";
import { useNavigate } from "react-router-dom";
import "./mainpage.css";

export default function MainPage() {

    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="banner">
                <h2>페이지 배너</h2>
                <button
                    className="register-btn"
                    onClick={() => navigate("/register")}
                >
                    등록
                </button>
            </div>

            {/* 카드 리스트 ... */}
        </div>
    );
}
