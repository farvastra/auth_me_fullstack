import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addReview } from "../../features/ReviewsSlice";
import { IoClose } from "react-icons/io5";
import "../styles/reviewModal.css";

const ReviewModal = ({ spotId, onClose }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review.length < 10 || stars === 0) return;

    try {
      const newReview = await dispatch(addReview({ spotId, review, stars })).unwrap();
      // Reset state & close modal
      resetForm();
      onClose(newReview); 
    } catch (err) {
      setError("Failed to submit review, Please try again.");
    }
  };

  const resetForm = () => {
    setReview("");
    setStars(0);
    setError(null);
  };

  return (
    <div className="review-modal">
      <div className="modal-content">
        <button className="close-button" onClick={() => { resetForm(); onClose(); }}>
          <IoClose size={24} />
        </button>

        <h2>How was your stay?</h2>
        {error && <p className="error">{error}</p>}

        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="rating">
          <label>Stars:</label>
          <select value={stars} onChange={(e) => setStars(Number(e.target.value))}>
            <option value={0}>Select Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSubmit} disabled={review.length < 10 || stars === 0}>
          Submit Your Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
