import {  createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { getCsrfTokenFromCookie } from "../../utils/getCsrfToken";

export const loginUser = createAsyncThunk(
  "session/login",
  async (userData, { rejectWithValue }) => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      
      if (!csrfToken) {
        return rejectWithValue("CSRF token not found");
      }
      //axiosInstance.defaults.headers.common["x-csrf-token"] = csrfToken;
      console.log("user CSRF", csrfToken);
      const response = await axiosInstance.post(
        "/session",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


export const signupUser = createAsyncThunk(
  "session/signup",
  async (userData, thunkAPI) => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      console.log("CSRF Token from cookie (signup):", csrfToken);
      if (!csrfToken) {
        return thunkAPI.rejectWithValue("CSRF token not found");
      }
      // axiosInstance.defaults.headers.common["x-csrf-token"] = csrfToken;
      const response = await axiosInstance.post(
        "/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log("Signup Response Data:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Signup failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("session/logout", async (_, thunkAPI) => {
  try {
    await axiosInstance.delete("/session");
    return null; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});

const sessionSlice = createSlice({
  name: "session",
  initialState: { user: null, error: null, loading: false },
  reducers: {
        setUser: (state, action) => {
          state.user = action.payload;
          localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logOut: (state) => {
          state.user = null;
          localStorage.removeItem('user'); 
        },
      },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.user = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.loading = false;

      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("Login Error - Payload:", action.payload); 
        state.error = action.payload;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log("Signup Success - Payload:", action.payload); 
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        console.log("Signup Error - Payload:", action.payload); 
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, logOut } = sessionSlice.actions;
export default sessionSlice.reducer;
