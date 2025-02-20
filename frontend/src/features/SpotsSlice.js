import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

const API_BASE_URL = "https://auth-me-backend.onrender.com/api/spots";

// FETCH ALL SPOTS (Owned by Current User)
export const fetchSpots = createAsyncThunk(
  "spots/fetchSpots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/current`);
      return response.data.Spots;
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update spot");
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

// SPOT SLICE
const spotSlice = createSlice({
  name: "spots",
  initialState: { spots: [], status: "idle", error: null },
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
      .addCase(createSpot.fulfilled, (state, action) => {
        state.spots.push(action.payload);
      })
      .addCase(createSpot.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateSpot.fulfilled, (state, action) => {
        const index = state.spots.findIndex(spot => spot.id === action.payload.id);
        if (index !== -1) state.spots[index] = action.payload;
      })
      .addCase(updateSpot.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteSpot.fulfilled, (state, action) => {
        state.spots = state.spots.filter(spot => spot.id !== action.payload);
      })
      .addCase(deleteSpot.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default spotSlice.reducer;
