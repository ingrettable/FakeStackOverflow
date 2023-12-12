import React, { useState } from 'react';
import '../stylesheets/MainPage.css';
import ErrorPopup from './errors/errorPopup';

export default function LoginPage({ handleSignInClick, logOn}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrors([
        {
          id: 0,
          title: 'Error',
          description: 'All fields are required.',
        },
      ]);
      return;
    }

    const loginSuccess = true;
    if (loginSuccess) {
      const userData = {
        email, 
        password
      }
      try {
        const response = await logOn(userData);
    
        if (response.success) {
          // User login successful
          setErrors([]);
          handleSignInClick();
        } else {
          // Display the generic error message
          setErrors([
            {
              id: 1,
              title: 'Error',
              description: response.message,
            },
          ]);
        }
      } catch (error) {
        // Handle unexpected errors
        setErrors([
          {
            id: 2,
            title: 'Error',
            description: 'An error occurred during login. Please try again later.',
          },
        ]);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="answerQuestionForm">
        {errors.map((error) => (
          <ErrorPopup
            key={error.id}
            id={error.id}
            title={error.title}
            description={error.description}
            setErrors={setErrors}
            errors={errors}
          />
        ))}
        <form>
          <label htmlFor="Email">Email*</label>
          <input
            type="text"
            id="registerEmail"
            name="registerEmail"
            value={email}
            onChange={handleEmail}
            required
          />
          <br />

          <label htmlFor="registerPassword">Password*</label>
          <input
            type="password"
            id="registerPassword"
            name="registerPassword"
            value={password}
            onChange={handlePassword}
            required
          />
          <button className="buttonStyleReg" type="button" onClick={handleSubmit}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
