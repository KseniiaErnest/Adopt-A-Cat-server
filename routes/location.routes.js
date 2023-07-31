const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const Location = require('../models/Location.model');
const Cat = require('../models/Cat.model');

// CREATE
router.post('/', (req, res, next) => {
// Get the JWT token from the request headers
const token = req.headers.authorization.split(' ')[1];

// Decode the token to get the user's ID
const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

// Extract the user's ID from the decoded token
const userId = decodedToken._id;

  // Add the createdBy field to the location data
  const locationData = { ...req.body, createdBy: userId };

  Location.create(locationData)
    .then((location) => {
      res.json({ success: true, location });
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });

  // Location.create(req.body)
  // .then((locationt) => {
  //   res.json({ success: true, locationt });
  // })
  // .catch((err) => {
  //   res.json({ success: false, error: err });
  // });
});

// READ ALL
router.get('/', (req, res, next) => {
  Location.find()
  .then((allLocations) => {
    res.json({ success: true, allLocations });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

// READ ONE
router.get('/:locationId', (req, res, next) => {
Location.findById(req.params.locationId)
.populate('cats')
.then((oneLocation) => {
  res.json({ success: true, oneLocation });
})
.catch((err) => {
  res.json({ success: false, error: err });
});
});

// UPDATE
router.put('/:locationId', (req, res, next) => {
 // Exclude 'cats' field from the update operation
//  delete req.body.cats

  Location.findByIdAndUpdate(req.params.locationId, req.body, { new: true })
  .then((locationUpdate) => {
    res.json({ success: true, locationUpdate });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

// DELETE
router.delete('/:locationId', (req, res, next) => {
  Location.findByIdAndRemove(req.params.locationId)
  .then(() => {
    res.json({ success: true, message: 'Successfully removed location' })
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

module.exports = router;