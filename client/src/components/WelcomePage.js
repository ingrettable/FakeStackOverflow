import React from 'react';
import '../stylesheets/MainPage.css';

export default function WelcomePage({ handleRegisterClick, handleLoginClick, handleFakeStack }) {
  return (
    <div>
      <div className="login-page">
        <button className="buttonStyle" onClick={handleRegisterClick}>
          Register as a New User
        </button>
        <button className="buttonStyle" onClick={handleLoginClick}>
          Login as an Existing User
        </button>
        <button className="buttonStyle" onClick={handleFakeStack}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
