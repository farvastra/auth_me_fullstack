import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, selectReviewsBySpotId, deleteReview } from "../../features/ReviewsSlice";
// import "./Reviews.css";

const Reviews = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => selectReviewsBySpotId(state, spotId));

  useEffect(() => {
    if (spotId) {
      dispatch(fetchReviews(spotId));
    }
  }, [dispatch, spotId]);

  const handleDelete = async (reviewId) => {
    try {
      await dispatch(deleteReview({ reviewId })).unwrap();
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="reviews-container">
      <h2>Reviews for Spot</h2>
      {reviews.length === 0 ? (
        <p>
          No reviews yet. <Link to={`/add-review/${spotId}`}>Add a review</Link>
        </p>
      ) : (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-card">
              <div className="review-header">
                <p className="review-user">
                  <strong>{review.User?.username || "Anonymous"}</strong> ({review.stars}⭐)
                </p>
                <button
                  className="delete-review-button"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </div>
              <p className="review-text">{review.review}</p>
            </li>
          ))}
        </ul>
      )}
      <Link to={`/add-review/${spotId}`} className="add-review-button">
        Add Review
      </Link>
    </div>
  );
};

export default Reviews;
