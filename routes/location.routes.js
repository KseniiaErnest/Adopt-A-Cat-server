const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Location = require('../models/Location.model');
const Cat = require('../models/Cat.model');

// CREATE
router.post('/', (req, res, next) => {
  Location.create(req.body)
  .then((locationt) => {
    res.json({ success: true, locationt });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
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