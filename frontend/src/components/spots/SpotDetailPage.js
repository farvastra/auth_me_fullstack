import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../features/SpotsSlice";
import { fetchReviews, selectReviewsBySpotId } from "../../features/ReviewsSlice";
import ReviewModal from "../reviews/ReviewModal";
import ReviewList from "../reviews/ReviewList";
import "../styles/spotDetail.css";

const SpotDetailPage = () => {
  const { id } = useParams();
  const spotId = Number(id);
  const dispatch = useDispatch();

  const { spot, status, error } = useSelector((state) => state.spots);
  const reviews = useSelector((state) => selectReviewsBySpotId(state, spotId));
  const currentUser = useSelector((state) => state.session.user);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState([]); 

  useEffect(() => {
    if (spotId) {
      dispatch(fetchSpotDetails(spotId));
      dispatch(fetchReviews(spotId));
    }
  }, [dispatch, spotId]);

  useEffect(() => {
    setLocalReviews(reviews); 
  }, [reviews]);

  if (status === "loading") return <p>Loading spot details...</p>;
  if (status === "failed") return <p className="error">{error || "Failed to load spot details."}</p>;
  if (!spot) return <p>No spot found.</p>;

  const reviewCount = localReviews.length;
  const avgRating =
    reviewCount > 0
      ? (localReviews.reduce((sum, review) => sum + review.stars, 0) / reviewCount).toFixed(2)
      : "New";

  const reviewText = reviewCount === 1 ? "1 Review" : reviewCount > 1 ? `${reviewCount} Reviews` : "New";

  const isOwner = currentUser?.id === spot.Owner?.id;
  const hasUserReviewed = localReviews.some((review) => review.User?.id === currentUser?.id);
  const showReviewButton = currentUser && !isOwner && !hasUserReviewed;

 

  const handleNewReview = () => {
    dispatch(fetchReviews(spotId)); 
    setIsReviewModalOpen(false);
  };
  
  
  return (
    <div className="spot-detail-container">
      <h1>{spot.name}</h1>
      <p className="location">{spot.city}, {spot.state}, {spot.country}</p>

      <div className="images-container">
        <img src={spot?.previewImage} alt={spot.name} className="large-image" />
        <div className="small-images">
          {[...Array(4)].map((_, index) => (
            <img key={index} src={spot?.previewImage} alt={spot.name} className="small-image" />
          ))}
        </div>
      </div>

      <p className="hosted-by">Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</p>
      <p className="description">{spot.description}</p>

      <div className="callout-box">
        <p className="price">${spot.price} <span>/ night</span></p>
        <p className="review-summary">
          ⭐ {avgRating} {reviewCount > 0 ? ` · ${reviewText}` : ""}
        </p>
        <button className="reserve-button" onClick={() => alert("Feature coming soon")}>
          Reserve
        </button>
      </div>

      <h2>⭐ {avgRating} {reviewCount > 0 ? ` · ${reviewText}` : ""}</h2>

      {showReviewButton && (
        <button className="post-review-button" onClick={() => setIsReviewModalOpen(true)}>
          Post Your Review
        </button>
      )}

      {isReviewModalOpen && <ReviewModal spotId={spotId} onClose={handleNewReview} />}

      {reviewCount === 0 ? (
  <p className="review-prompt">Be the first to post a review!</p>
) : (
  <ReviewList reviews={localReviews} spotId={spot.id} />
)}

    </div>
  );
};

export default SpotDetailPage;
