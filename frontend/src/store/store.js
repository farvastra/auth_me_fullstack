import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "../features/session/SessionSlice"; 
import spotsReducer from "../features/SpotsSlice"; 
import reviewsReducer from "../features/ReviewsSlice";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    spots: spotsReducer,
    reviews: reviewsReducer,
  },
});

export default store;
