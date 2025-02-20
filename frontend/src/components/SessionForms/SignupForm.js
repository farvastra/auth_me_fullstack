import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, setUser } from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login-signup.css";

const SignupForm = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.session);
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signupUser(userData)).then((res) => {
      if (res.payload?.user) {
        const userDetails = res.payload.user;
        dispatch(setUser(userDetails));
        localStorage.setItem("user", JSON.stringify(res.payload.user));  
        navigate("/spots");  
      } else {
        console.error("Signup failed, no user in response:");
        console.log(error?.message)
      }
    });
    
  };

  return (
    <div className="signup-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} value={userData.firstName} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} value={userData.lastName} />
        <input name="username" placeholder="Username" onChange={handleChange} value={userData.username} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} value={userData.email} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} value={userData.password} />

        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
