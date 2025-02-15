import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosInstance";


export const loginUser = createAsyncThunk("login", async (body, thunkAPI) => {
  try {

   

    const response = await axiosInstance.post("https://auth-me-backend.onrender.com/api/session", body);

    console.log(response.data)

    return await response.data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }

});


export const signupUser = createAsyncThunk("session/signup", async (userData, thunkAPI) => {
  try {

    const response = await axiosInstance.post("https://auth-me-backend.onrender.com/api/users",
      userData);

    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response.data); 
  }
});


export const logoutUser = createAsyncThunk("session/logout", async (_, thunkAPI) => {
  try {
    await axiosInstance.delete("https://auth-me-backend.onrender.com/api/session");
    return null; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});


// Define the slice
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
