import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addReview } from "../../features/ReviewsSlice";

const AddReview = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText.trim() || stars < 1 || stars > 5) {
      setError("Review text is required and stars must be between 1 and 5.");
      return;
    }

    try {
  
      await dispatch(addReview({ spotId, review: reviewText, stars })).unwrap();
      navigate(`/spots/${spotId}/reviews`);
    } catch (err) {
      
      setError(err || "Failed to add review. Please try again.");
    }
  };

  return (
    <div className="add-review-container">
      <h2>Add Review</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Review:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />

        <label>Stars (1-5):</label>
        <select value={stars} onChange={(e) => setStars(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;
