import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../features/session/SessionSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from '../../features/session/SessionSlice';
import "../styles/login-signup.css"

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
    const result = await dispatch(signupUser(userData));
     const userDetails = result.payload.user; 
            console.log(result, userDetails);
            dispatch(setUser(userDetails));
    if (result.meta.requestStatus === "fulfilled")
       navigate("/spots");
    console.log('Dispatch result:', result);

   
  };

  return (
    <div className="signup-container">
      
      {error?.message && (
  <p style={{ color: "red" }}>{error.message}</p>
)}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      </form>
    </div>
  );
};

export default SignupForm;
