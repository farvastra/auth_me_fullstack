import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login-signup.css";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.session.error);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User payload", { credential, password });

    try {
      const result = await dispatch(loginUser({ credential, password }));
      console.log("loginUser result:", result);

      if (result.meta.requestStatus === "fulfilled" && result.payload) {
        const userData = result.payload;
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/spots");
      } else {
        setErrorMessage("Login failed: check your credentials");
        console.error("Login failed: No user data returned");
      }
    } catch (error) {
      console.error("Failed to login:", error);
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {(error || errorMessage) && <p className="error">{error || errorMessage}</p>}
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
