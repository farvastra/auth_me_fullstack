import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../../features/ReviewsSlice";
import "../styles/reviews.css";

const ReviewList = ({ reviews, spotId }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user?.id);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reviewId: null });

  const handleDeleteConfirm = async () => {
    if (deleteModal.reviewId) {
      console.log("Deleting review with ID:", deleteModal.reviewId);
      await dispatch(deleteReview({ reviewId: deleteModal.reviewId, spotId })); // Ensure spotId is included
      setDeleteModal({ isOpen: false, reviewId: null });
    }
  };
  
return (
    <div>
      <ul className="reviews-list">
        {reviews.map((review) => {
          const reviewDate = new Date(review.createdAt);
          const formattedDate = reviewDate.toLocaleString("default", { month: "long", year: "numeric" });

          return (
            <li key={review.id} className="review-item">
              <strong>{review.User?.firstName}</strong> - {formattedDate}
              <p>{review.review}</p>

          
              {userId === review.userId && (
                <button
                  className="delete-review-btn"
                  onClick={() => setDeleteModal({ isOpen: true, reviewId: review.id })}
                >
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>

      
      {deleteModal.isOpen && (
        <div className="delete-modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="modal-buttons">
              <button className="delete-confirm-btn" onClick={handleDeleteConfirm}>
                Yes (Delete Review)
              </button>
              <button
                className="cancel-btn"
                onClick={() => setDeleteModal({ isOpen: false, reviewId: null })}
              >
                No (Keep Review)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
