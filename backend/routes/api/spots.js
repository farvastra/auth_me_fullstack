const express = require("express");
const { Op } = require("sequelize");
const {
  Spot,
  User,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models"); 
const { setTokenCookie, restoreUser } = require("../../utils/auth"); 
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Get all Spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll();
  return res.json({ Spots: spots });
});

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
  });
  return res.json({ Spots: spots });
});

// Get details of  a spot from an id

router.get("/:id", async (req, res) => {
  const spot = await Spot.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: SpotImage,
        as: "images",
        attributes: ["id", "url", "preview"],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  return res.json(spot);
});

// Create a Spot
router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.status(201).json(newSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post("/:id/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { url, preview } = req.body;
  const newImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  return res.status(201).json(newImage);
});

// Edit a Spot
router.put("/:id", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.json(spot);
});

// Delete a Spot
router.delete("/:id", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await spot.destroy();

  return res.json({ message: "Successfully deleted" });
});

module.exports = router;

// REVIEWS

// EDit/Update a Review
router.put("/reviews/:id", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { review: updatedReview, stars } = req.body;

  if (!updatedReview || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }

  review.review = updatedReview;
  review.stars = stars;

  await review.save();

  return res.json(review);
});

// Delete a Review
router.delete("/reviews/:id", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await review.destroy();

  return res.json({ message: "Successfully deleted" });
});

// GET a Specific Review

router.get("/reviews/:id", async (req, res) => {
  const review = await Review.findByPk(req.params.id, {
    include: [{ model: User }, { model: ReviewImage }],
  });

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  return res.json(review);
});

// Get all reviews by the current user
router.get("/current/reviews", requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"], // Include User details
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
          "previewImage",
        ], 
      },
      {
        model: ReviewImage,
        as: "ReviewImages", 
        attributes: ["id", "url"], 
      },
    ],
  });

  return res.json({ Reviews: reviews });
});

// Get all Reviews by a Specific Spot
router.get("/spots/reviews/:spotId", async (req, res) => {
  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [{ model: User }, { model: ReviewImage }],
  });

  if (reviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for this spot" });
  }

  return res.json({ Reviews: reviews });
});

// Add an Image to a Review based on review id

router.post("/reviews/:reviewId/images", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const reviewImagesCount = await ReviewImage.count({
    where: { reviewId: review.id },
  });
  if (reviewImagesCount >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const { url } = req.body;
  const newImage = await ReviewImage.create({ reviewId: review.id, url });

  return res.status(201).json(newImage);
});

// Create a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { review, stars } = req.body;

  // Validate request body
  if (!review || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }

  // Check if the spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Check if the user has already reviewed this spot
  const existingReview = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId: spot.id,
    },
  });
  if (existingReview) {
    return res
      .status(500)
      .json({ message: "User already has a review for this spot" });
  }

  // Create a new review
  const newReview = await Review.create({
    userId: req.user.id,
    spotId: spot.id,
    review,
    stars,
  });

  return res.status(201).json(newReview);
});

// BOOKINGS

// Get all of the Current User's Bookings
router.get("/bookings/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId },
    include: {
      model: Spot,
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "price",
        "previewImage",
      ],
    },
  });

  return res.status(200).json({ Bookings: bookings });
});

// Get all Bookings for a Spot based on the Spot's ID
router.get("/spots/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const bookings = await Booking.findAll({
    where: { spotId: spot.id },
    include:
      req.user.id === spot.ownerId
        ? {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          }
        : null,
  });

  return res.status(200).json({ Bookings: bookings });
});

// Create a Booking from a Spot based on the Spot's ID
router.post("/spots/:spotId/bookings", requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: "You cannot book your own spot" });
  }

  if (
    new Date(startDate) < new Date() ||
    new Date(endDate) <= new Date(startDate)
  ) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  // Check for booking conflicts
  const existingBookings = await Booking.findAll({
    where: {
      spotId: spot.id,
      [Op.or]: [
        {
          startDate: { [Op.lte]: endDate },
          endDate: { [Op.gte]: startDate },
        },
      ],
    },
  });

  if (existingBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId: spot.id,
    startDate,
    endDate,
  });

  return res.status(201).json(newBooking);
});
// Edit a Booking

router.put("/bookings/:bookingId", requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (
    new Date(startDate) < new Date() ||
    new Date(endDate) <= new Date(startDate)
  ) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  // Check for booking conflicts
  const conflictingBookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
      id: { [Op.ne]: booking.id },
      [Op.or]: [
        {
          startDate: { [Op.lte]: endDate },
          endDate: { [Op.gte]: startDate },
        },
      ],
    },
  });

  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  return res.status(200).json(booking);
});

// Delete a Booking

router.delete("/bookings/:bookingId", requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== req.user.id && booking.Spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (new Date(booking.startDate) <= new Date()) {
    return res
      .status(403)
      .json({ message: "Bookings that have been started can't be deleted" });
  }

  await booking.destroy();
  return res.status(200).json({ message: "Successfully deleted" });
});

// Delete a Spot Image

router.delete("/spot-images/:imageId", requireAuth, async (req, res) => {
  const image = await SpotImage.findByPk(req.params.imageId);

  if (!image) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  const spot = await Spot.findByPk(image.spotId);
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({ message: "Successfully deleted" });
});

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

// Add Query filters to get all spots

router.get("/spots/filter", async (req, res) => {
  const {
    page = 1,
    size = 20,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;

  const pagination = {
    limit: size,
    offset: (page - 1) * size,
  };

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { [Op.lte]: maxPrice };

  const spots = await Spot.findAll({ where, ...pagination });

  return res.status(200).json({ Spots: spots, page, size });
});

module.exports = router;
