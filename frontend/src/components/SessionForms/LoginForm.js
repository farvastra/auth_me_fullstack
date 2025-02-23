import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/demoLoginButton.css'
import "../styles/login-signup.css";

const LoginForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
  const error = useSelector((state) => state.session.error); 

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (credential.length < 4 || password.length < 6) {
      setErrorMessage("Username must be at least 4 characters and password at least 6 characters.");
      console.log("lessthan", errorMessage)
      return;
    }

  try {
    const result = await dispatch(loginUser({ credential, password }));
    console.log("loginUser result:", result);

    if (result.meta.requestStatus === "fulfilled" && result.payload) {
      const userData = result.payload;
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      onClose();
      navigate("/spots/manage-spots");
    } else {
      setErrorMessage("Login failed: check your credentials");
      console.error("Login failed: No user data returned");
    }
  } catch (error) {
    console.error("Failed to login:", error);
    setErrorMessage("An unexpected error occurred");
  }
};

//  log in as Demo User
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
      onClose();
      navigate('/spots/manage-spots');
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setLoading(false);
    }
  }, 2000);
};


if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Login</h2>
        
        {(error || errorMessage) && <p className="error">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={credential.length < 4 || password.length < 6}>
            Login
          </button>
          <button onClick={handleDemoLogin} className="demo-login-button" disabled={loading}>
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Log in as Demo User'}
              </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
