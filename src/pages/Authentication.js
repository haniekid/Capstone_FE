import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from "../components/auth/RegisterForm";
import Login from "../components/auth/LoginForm";
import { useUser } from '../utils/hooks/useUser';

function Authentication() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { currentUser, token } = useUser();

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      try {
        // Decode token to check expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        // If token is still valid, redirect to account
        if (currentTime < expirationTime) {
          navigate('/account');
        }
      } catch (error) {
        console.error('Error checking token validity:', error);
      }
    }
  }, [token, navigate]);

  return (
    <div className='auth container'>
      <div className='auth-container'>
        {activeTab === 'login' && <Login />}
        {activeTab === 'signup' && <Register />}
      </div>
      <div>
        <a
          className={`tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}>
          Already a member?
        </a>
        <a
          className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}>
          Not a member yet?
        </a>
      </div>
    </div>
  );
}

export default Authentication;
