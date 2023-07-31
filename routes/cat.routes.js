const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Cat = require('../models/Cat.model');
const Location = require('../models/Location.model');

// CREATE
router.post('/', (req, res, next) => {
  // Check if the 'species' field is provided in the request body
  const { name, age, breed, gender, color, description, availability, images, dateOfEntry, location, species } = req.body;
if (!species || (species !== 'Cat' && species !== 'Dog')) {
  return res.json({ success: false, error: "Invalid species. Must be 'Cat' or 'Dog'. " });
};

  // Check if the provided location ID exists in the database
  Location.findById(location)
    .then(existingLocation => {
      if (!existingLocation) {
        return res.json({ success: false, error: "Location not found" });
      }

      // Create the cat or dog and associate it with the location
      Cat.create({
        species,
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
  // Check if the 'species' query parameter is provided
  const { species } = req.query;
  // If species is provided, filter by species; otherwise, get all cats and dogs
  const query = species ? { species } : {};
  Cat.find(query)
  .populate('location')
  .then((allCats) => {
    res.json({ success: true, allCats });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

// READ ONE
router.get('/:petId', (req, res, next) => {
const petId = req.params.petId;
// Get the species value from the query parameters
const species = req.query.species;

Cat.findOne({ _id: petId, species: species })
.populate('location')
.then((oneCat) => {
  res.json({ success: true, oneCat });
})
.catch((err) => {
  res.json({ success: false, error: err });
});
});

// UPDATE
router.put('/:petId', (req, res, next) => {
  const petId = req.params.petId;
  // Get the species value from the query parameters
  const species = req.query.species;

  // Merge the species field into the update data
  const updateData = { ...req.body, species: species };

  Cat.findByIdAndUpdate(petId, updateData, { new: true })
  .then((catUpdate) => {
    res.json({ success: true, catUpdate });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});


// DELETE
router.delete('/:petId', (req, res, next) => {
  const petId = req.params.petId;
  // Get the species value from the query parameters
  const species = req.query.species;

  Cat.findOneAndRemove({ _id: petId, species: species })
  .then(() => {
    res.json({ success: true, message: 'Successfully removed a pet' })
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

module.exports = router;
