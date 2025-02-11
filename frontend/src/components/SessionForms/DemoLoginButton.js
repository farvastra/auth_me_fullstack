import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, setUser } from '../../features/session/SessionSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/demoLoginButton.css'; 

const DemoLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);


    setTimeout(async () => {
      const demoCredentials = {
        credential: 'demo@user.io', 
        username: "Demo-lition",
        password: 'password'
      };

      try {
       
        const result = await dispatch(loginUser(demoCredentials)).unwrap();
       
        dispatch(setUser(result.user));
        navigate('/spots');
      } catch (error) {
        console.error('Demo login failed:', error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <button onClick={handleDemoLogin} className="demo-login-button" disabled={loading}>
      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Demo Login'}
    </button>
  );
};

export default DemoLoginButton;
