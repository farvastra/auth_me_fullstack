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
const { validateSpot } = require("../../utils/validation");
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

router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findOne({
    where: { id: req.params.spotId },
    include: [
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["id", "url", "preview"],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  const spotData = {
    ...spot.toJSON(),
    avgStarRating: spot.avgRating || 0,
    numReviews: spot.numReviews || 0,
  };

  return res.status(200).json(spotData);
});

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

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
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Bad Request",
        errors: error.errors.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {}),
      });
    }
    next(error);
  }
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
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

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

  return res.status(200).json(spot);
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

// REVIEWS
// Get all Reviews by a Specific Spot

router.get("/:spotId/reviews", async (req, res) => {
 
  const spot = await Spot.findByPk(req.params.spotId); // Assuming you have a Spot model
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

 
  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [{ model: User }, { model: ReviewImage }],
  });

  
  return res.json({ Reviews: reviews });
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


// Add Query filters to get all spots

router.get("/spots/filter", async (req, res) => {
  let {
    page = 2,
    size = 20,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;

  // Convert query parameters to numbers where applicable
  page = Number(page);
  size = Number(size);
  minLat = minLat ? Number(minLat) : undefined;
  maxLat = maxLat ? Number(maxLat) : undefined;
  minLng = minLng ? Number(minLng) : undefined;
  maxLng = maxLng ? Number(maxLng) : undefined;
  minPrice = minPrice ? Number(minPrice) : undefined;
  maxPrice = maxPrice ? Number(maxPrice) : undefined;

  // Validate query parameters
  if (
    isNaN(page) ||
    isNaN(size) ||
    (minLat && isNaN(minLat)) ||
    (maxLat && isNaN(maxLat)) ||
    (minLng && isNaN(minLng)) ||
    (maxLng && isNaN(maxLng)) ||
    (minPrice && isNaN(minPrice)) ||
    (maxPrice && isNaN(maxPrice))
  ) {
    return res.status(400).json({ message: "Bad Request" });
  }

  // Pagination and filtering
  const pagination = {
    limit: size,
    offset: (page - 1) * size,
  };

  const where = {};
  if (minLat !== undefined) where.lat = { [Op.gte]: minLat };
  if (maxLat !== undefined) where.lat = { [Op.lte]: maxLat };
  if (minLng !== undefined) where.lng = { [Op.gte]: minLng };
  if (maxLng !== undefined) where.lng = { [Op.lte]: maxLng };
  if (minPrice !== undefined) where.price = { [Op.gte]: minPrice };
  if (maxPrice !== undefined) where.price = { [Op.lte]: maxPrice };

  try {
    const spots = await Spot.findAll({ where, ...pagination });
    // Include `page` and `size` keys in the response
    return res.status(200).json({ Spots: spots, page, size });
  } catch (error) {
    console.error("Error fetching spots:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
