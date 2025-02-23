import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

const API_BASE_URL = "https://auth-me-backend.onrender.com/api/spots";

// FETCH ALL SPOTS (Owned by Current User)
export const fetchSpots = createAsyncThunk(
  "spots/fetchSpots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/spots");
  
      return response.data.Spots.map((spot) => ({
        ...spot,
        avgStarRating: parseFloat(spot.avgStarRating) || 0, 
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch spots");
    }
  }
);


// CREATE SPOT
export const createSpot = createAsyncThunk(
  "spots/createSpot",
  async (spotData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL, spotData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create spot");
    }
  }
);

// UPDATE SPOT
export const updateSpot = createAsyncThunk(
  "spots/updateSpot",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update spot");
    }
  }
);

// Fetch SPOT by Id
export const fetchSpotDetails = createAsyncThunk(
  "spotDetail/fetchSpotDetails",
  async (id, { rejectWithValue }) => {
    if (!id || isNaN(id)) {
      return rejectWithValue("Invalid spot ID");
    }
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch spot details");
    }
  }
);


// DELETE SPOT
export const deleteSpot = createAsyncThunk(
  "spots/deleteSpot",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/${id}`);
      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete spot");
    }
  }
);


// FETCH ALL SPOTS (Owned by Current User)
export const fetchUserSpots = createAsyncThunk(
  "userSpots/fetchUserSpots", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/current`);
      console.log("response", response.data);
      return response.data.Spots;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user spots");
    }
  }
);

// SPOT SLICE
const spotSlice = createSlice({
  name: "spots",
  initialState: {
    spots: [],
    spot: null,  
    userSpots: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpots.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSpots.fulfilled, (state, action) => {
        state.spots = Array.isArray(action.payload) ? action.payload : [];
        state.status = "succeeded";
      })
      .addCase(fetchSpots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSpotDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSpotDetails.fulfilled, (state, action) => {
        state.spot = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSpotDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserSpots.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserSpots.fulfilled, (state, action) => {
        state.userSpots = Array.isArray(action.payload) ? action.payload : [];
        state.status = "succeeded";
      })
      .addCase(fetchUserSpots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export default spotSlice.reducer;
