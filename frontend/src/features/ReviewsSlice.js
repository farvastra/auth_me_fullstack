import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance"; 
const API_BASE_URL = "https://auth-me-backend.onrender.com/api/spots";

// FETCH REVIEWS for a Specific Spot
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (spotId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${spotId}/reviews`);
      return { spotId, reviews: response.data.Reviews };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

// ADD A NEW REVIEW
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ spotId, review, stars }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${spotId}/reviews`, { review, stars });
      return { spotId, newReview: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add review");
    }
  }
);

//  DELETE A REVIEW
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ reviewId, spotId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`https://auth-me-backend.onrender.com/api/reviews/${reviewId}`);
      return { reviewId, spotId }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
  }
);

// INITIAL STATE
const initialState = {
  reviewsBySpotId: {},
  error: null
};

//  REVIEWS SLICE
const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviewsBySpotId[action.payload.spotId] = action.payload.reviews || [];
        state.error = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        if (!state.reviewsBySpotId[action.payload.spotId]) {
          state.reviewsBySpotId[action.payload.spotId] = [];
        }
        state.reviewsBySpotId[action.payload.spotId].push(action.payload.newReview);
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const { reviewId, spotId } = action.payload; 
        if (state.reviewsBySpotId[spotId]) {
          state.reviewsBySpotId[spotId] = state.reviewsBySpotId[spotId].filter(
            (review) => review.id !== reviewId
          );
        }
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default reviewsSlice.reducer;

// Get Reviews by Spot ID
export const selectReviewsBySpotId = createSelector(
  (state) => state.reviews.reviewsBySpotId || {},
  (_, spotId) => spotId,
  (reviewsBySpotId, spotId) => reviewsBySpotId[spotId] || []
);
