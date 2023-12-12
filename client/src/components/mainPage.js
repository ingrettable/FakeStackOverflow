import React, { useState } from 'react';
import '../stylesheets/MainPage.css';
import WelcomePage from './WelcomePage';
import RegisterPage from './registerPage';
import LoginPage from './loginPage';
import axios from 'axios';

export default function MainPage({ server, handleFakeStack, setUserData }) {
  const [currentPage, setCurrentPage] = useState('welcome');

  const handleRegisterClick = () => {
    setCurrentPage('register');
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleSignInClick = () => {
    handleFakeStack();
  };


  async function addRegistrationToServer(userData) {
    try {
      const response = await axios.post(`${server}/register`, userData);
  
      if (response.status === 201) {
        console.log('User registered successfully:', response.data);
      } else {
        console.error('Registration failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  async function logOn(userData) {
    try {
      const response = await axios.post(`${server}/login`, userData);
      if (response.status === 200) {
        console.log('User login successful:', response.data);
        setUserData(response.data);
        // console.log(response.data)
        handleSignInClick();
        return { success: true, data: response.data };
      } else {
        return { success: false, message: 'Invalid email or password.' }
      }
    } catch (error) {
      return { success: false, message: 'Invalid email or password.' };
    }
  }
  
  async function checkEmailExists(email) {
    try {
      const response = await axios.post(`${server}/checkEmail`, { email });
  
      if (response.data.exists) {
        console.log('Email exists');
        return true;
      } else {
        console.log('Email does not exist');
        return false;
      }
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  async function checkUsernameExists(username) {
    try {
      const response = await axios.post(`${server}/checkUsername`, { username });
  
      if (response.data.exists) {
        console.log('Username exists');
        return true;
      } else {
        console.log('Username does not exist');
        return false;
      }
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  }
  
  return (
    <div>
      <div className="page">
        <div className="head">
          <div className="headerTitle">
            <h1>🧚‍♀️✨Fake Stack Overflow🧚‍♀️✨</h1>
          </div>
        </div>
      </div>
      {currentPage === 'welcome' && (
        <WelcomePage
          handleRegisterClick={handleRegisterClick}
          handleLoginClick={handleLoginClick}
          handleFakeStack={handleSignInClick} 
        />
      )}
      {currentPage === 'register' && <RegisterPage addRegistrationToServer={addRegistrationToServer} setWelcomePage={handleLoginClick} 
       checkUsernameExists={checkUsernameExists}
       checkEmailExists={checkEmailExists}
       />}
      {currentPage === 'login' && (
        <LoginPage handleSignInClick={handleSignInClick} logOn={logOn} />
      )}
    </div>
  );
}
