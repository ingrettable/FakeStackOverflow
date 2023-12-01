import React, { useState } from 'react';
import ErrorPopup from './errors/errorPopup';

const RegisterPage = ({ addRegistrationToServer, setWelcomePage, checkUsernameExists, checkEmailExists }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
  const [errors, setErrors] = useState([]);

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordVerification = (event) => {
    setPasswordVerification(event.target.value);
  };

  const handleSubmit = async () => {
    const newErrors = [];

    if (!username || !email || !password || !passwordVerification) {
      newErrors.push({
        id: 0,
        title: 'Error',
        description: 'All fields are required.',
      });
    }

    if (password !== passwordVerification) {
      newErrors.push({
        id: 1,
        title: 'Error',
        description: 'Password and password verification do not match.',
      });
    }

    // Check if username is taken
    const isUsernameTaken = await checkUsernameExists(username);
    if (isUsernameTaken) {
      newErrors.push({
        id: 2,
        title: 'Error',
        description: 'Username is already taken.',
      });
    }

    // Check if email is taken
    const isEmailTaken = await checkEmailExists(email);
    if (isEmailTaken) {
      newErrors.push({
        id: 3,
        title: 'Error',
        description: 'Email is already registered.',
      });
    }

    // Check if email is valid
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    if (!isValidEmail(email)) {
      newErrors.push({
        id: 4,
        title: 'Error',
        description: 'Email is invalid.',
      });
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      const userData = {
        username,
        email,
        password,
      };

      addRegistrationToServer(userData);

      setWelcomePage('login');
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
          <label htmlFor="registerUsername">Username*</label>
          <input
            type="text"
            id="registerUsername"
            name="registerUsername"
            value={username}
            onChange={handleUsername}
            required
          />
          <br />

          <label htmlFor="registerEmail">Email*</label>
          <input
            type="email"
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
          <br />

          <label htmlFor="registerPasswordVerification">Password Verification*</label>
          <input
            type="password"
            id="registerPasswordVerification"
            name="registerPasswordVerification"
            value={passwordVerification}
            onChange={handlePasswordVerification}
            required
          />
          <br />

          <button className="buttonStyleReg" type="button" onClick={handleSubmit}>
            Register
          </button>
        </form>
        <p>
          Already have an account?{' '}
          <span className="buttonStyle" onClick={() => setWelcomePage('login')}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
