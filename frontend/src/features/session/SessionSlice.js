
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// LOGIN USER
export const loginUser = createAsyncThunk(
  "session/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/session", userData);
      const data = response.data;

      if (data.token) {
        console.log("token", data.token);
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user)); 
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid credentials");
    }
  }
);

// SIGNUP USER
export const signupUser = createAsyncThunk(
  "session/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users", userData);
      const data = response.data;

      if (data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { user: data.user, token: data.token };
      } else {
        return rejectWithValue("Unexpected response format");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);

      let errorMessage = "Signup failed. Please try again.";
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).join(", ");
        }
      }

      return rejectWithValue(errorMessage); 
    }
  }
);

// LOGOUT USER
export const logoutUser = createAsyncThunk("session/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete("/session");

    localStorage.removeItem("token"); 
    localStorage.removeItem("user");  

    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Logout failed");
  }
});

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
            state.user = action.payload;
          },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed. Please try again.";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed. Please try again.";
      });
  },
});


export const { setUser, logOut } = sessionSlice.actions;
export default sessionSlice.reducer;
