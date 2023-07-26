const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Cat = require('../models/Cat.model');
const Location = require('../models/Location.model');

// CREATE
router.post('/', (req, res, next) => {
  const { name, age, breed, gender, color, description, availability, images, dateOfEntry, location } = req.body;

  // Check if the provided location ID exists in the database
  Location.findById(location)
    .then(existingLocation => {
      if (!existingLocation) {
        return res.json({ success: false, error: "Location not found" });
      }

      // Create the cat and associate it with the location
      Cat.create({
        name,
        age,
        breed,
        gender,
        color,
        description,
        availability,
        images,
        dateOfEntry,
        location: existingLocation._id, // Assign the location ID to the cat's location field
      })
      .then(cat => {
        // Associate the created cat with the location
        existingLocation.cats.push(cat._id);
        existingLocation.save();

        res.json({ success: true, cat });
      })
      .catch(err => {
        res.json({ success: false, error: err });
      });
    })
    .catch(err => {
      res.json({ success: false, error: err });
    });
});

// READ ALL
router.get('/', (req, res, next) => {
  Cat.find()
  .populate('location')
  .then((allCats) => {
    res.json({ success: true, allCats });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

// READ ONE
router.get('/:catId', (req, res, next) => {
Cat.findById(req.params.catId)
.populate('location')
.then((oneCat) => {
  res.json({ success: true, oneCat });
})
.catch((err) => {
  res.json({ success: false, error: err });
});
});

// UPDATE
router.put('/:catId', (req, res, next) => {

  Cat.findByIdAndUpdate(req.params.catId, req.body, { new: true })
  .then((catupdate) => {
    res.json({ success: true, catupdate });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});


// DELETE
router.delete('/:catId', (req, res, next) => {
  Cat.findByIdAndRemove(req.params.catId)
  .then(() => {
    res.json({ success: true, message: 'Successfully removed cat' })
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

module.exports = router;
