import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {loginUser} from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from '../../features/session/SessionSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.session.error);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table({ credential, password });
    
    try {
      const result = await dispatch(loginUser({credential, password}));
      
      const userData = result.payload.user.username ; 
      console.log(result, userData);
      dispatch(setUser(userData));
      if (result.meta.requestStatus === "fulfilled") 
        navigate("/spots");
    } catch (error) {
      
      console.error("Failed to login:", error);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">Invalid credentials</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
