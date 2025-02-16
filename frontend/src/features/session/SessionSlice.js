import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance, {restoreCSRF}  from "../../utils/axiosInstance";


// export const loginUser = createAsyncThunk(
//   "session/login",
//   async (userData, { rejectWithValue }) => {
//     try {
    
//       await restoreCSRF();
//       const csrfToken = axiosInstance.defaults.headers.common["X-XSRF-TOKEN"];
//       console.log("CSRF Token:", csrfToken);

//       const response = await axiosInstance.post(
//         "/session",
//         userData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "X-XSRF-TOKEN": csrfToken,
//           },
//           withCredentials: true,
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );


export const loginUser = createAsyncThunk(
  "session/login",
  async (userData, { rejectWithValue }) => {
    try {
      const csrfResponse = await axiosInstance.get("/csrf/restore", { withCredentials: true });
      const csrfToken =
        csrfResponse.data["XSRF-Token"] ||
        csrfResponse.data.csrfToken ||
        csrfResponse.data.token;
      console.log("Fresh CSRF Token:", csrfToken);
 
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
      console.log("Login Response Data:", response.data);
      return response.data;
    } catch (error) {
  
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const signupUser = createAsyncThunk("session/signup", async (userData, thunkAPI) => {
  try {
    await restoreCSRF();
      const csrfToken = axiosInstance.defaults.headers.common["X-XSRF-TOKEN"];
    const response = await axiosInstance.post("/users",
      userData,{
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        withCredentials: true, 
      });

    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response.data); 
  }
});


export const logoutUser = createAsyncThunk("session/logout", async (_, thunkAPI) => {
  try {
    await axiosInstance.delete("/session");
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
