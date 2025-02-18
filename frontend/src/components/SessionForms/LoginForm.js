import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {loginUser} from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from '../../features/session/SessionSlice';
import "../styles/login-signup.css"

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.session.error);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user payload", { credential, password });
    try {
      const result = await dispatch(loginUser({ credential, password }));
      console.log("loginUser result: ", result);    
      if (loginUser.fulfilled.match(result)) {
        ///console.log("userData", result.payload.user);
        navigate("/spots");
      }else{
        setErrorMessage("Login failed: check your credential or password");
      }  
      if (result.payload && result.payload.user) {
        const userData = result.payload.user; 
        console.log(result, userData);
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        if (result.meta.requestStatus === "fulfilled") 
                  navigate("/spots");
      } else {
        console.error("Login failed: No user data returned");
      }

    } catch (error) {
      
      console.error("Failed to login:", error);
    }
    
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{errorMessage}</p>}
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
