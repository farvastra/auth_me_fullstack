const express = require("express");
const { Op } = require("sequelize");
const {
  
  Review,
  ReviewImage,
 
} = require("../../db/models");
const {requireAuth} = require("../../utils/auth");
const router = express.Router();



// Delete a Review Image

router.delete("/review-images/:imageId", requireAuth, async (req, res) => {
  const image = await ReviewImage.findByPk(req.params.imageId);

  if (!image) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  }

  const review = await Review.findByPk(image.reviewId);
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router