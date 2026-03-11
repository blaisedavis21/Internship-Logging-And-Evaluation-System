import { Link } from "react-router-dom";
import "./login.css";

function Start() {
  return (
    <div className="login-page">
      <div className="login-grid-pattern" />
      <div className="login-blob-left" />
      <div className="login-blob-right" />

      <div className="login-card-wrapper">
        <div className="login-header">
          <h1 className="login-title">
            Welcome to <span className="login-title-highlight">ILES</span>
          </h1>
          <p className="login-subtitle">
            Internship Logging &amp; Evaluation System
          </p>
        </div>

        <div className="login-form">
          <p className="login-footer-text">Ready to get started?</p>
          <Link
            to="/login"
            className="login-submit"
            style={{ textDecoration: "none" }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;

