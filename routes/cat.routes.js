// const express = require("express");
// const router = express.Router();
// const mongoose = require('mongoose');

// const Cat = require('../models/Cat.model');
// const Location = require('../models/Location.model');

// // CREATE
// router.post('/', (req, res, next) => {
//   // Check if the 'species' field is provided in the request body
//   const { name, age, breed, gender, color, description, availability, images, dateOfEntry, location, species } = req.body;
// if (!species || (species !== 'Cat' && species !== 'Dog')) { 
//   return res.json({ success: false, error: "Invalid species. Must be 'Cat' or 'Dog'. " });


// const speciesEnum = ['Cat', 'Dog'] };

//  if (!!speciesEnum.toLowerCase().includes(species?.toLowerCase()) {
 // return res.json({ success: false, error: "Invalid species. Must be 'Cat' or 'Dog'. " });
//  })

//   // Check if the provided location ID exists in the database
//   Location.findById(location)
//     .then(existingLocation => {
//       if (!existingLocation) {
//         return res.json({ success: false, error: "Location not found" });
//       }

//       // Create the cat or dog and associate it with the location
//       Cat.create({
//         species,
//         name,
//         age,
//         breed,
//         gender,
//         color,
//         description,
//         availability,
//         images,
//         dateOfEntry,
//         location: existingLocation._id, // Assign the location ID to the cat's location field
//       })
//       .then(cat => {
//         // Associate the created cat with the location
//         existingLocation.cats.push(cat._id);
//         existingLocation.save();

//         res.json({ success: true, cat });
//       })
//       .catch(err => {
//         res.json({ success: false, error: err });
//       });
//     })
//     .catch(err => {
//       res.json({ success: false, error: err });
//     });
// });

// // READ ALL
// router.get('/', (req, res, next) => {
//   // Check if the 'species' query parameter is provided
//   const { species } = req.query;
//   // If species is provided, filter by species; otherwise, get all cats and dogs
//   const query = species ? { species } : {};
//   Cat.find(query)
//   .populate('location')
//   .then((allCats) => {
//     res.json({ success: true, allCats });
//   })
//   .catch((err) => {
//     res.json({ success: false, error: err });
//   });
// });

// // READ ONE
// router.get('/:petId', (req, res, next) => {
// const petId = req.params.petId;
// // Get the species value from the query parameters
// const species = req.query.species;

// Cat.findOne({ _id: petId, species: species })
// .populate('location')
// .then((oneCat) => {
//   res.json({ success: true, oneCat });
// })
// .catch((err) => {
//   res.json({ success: false, error: err });
// });
// });

// // UPDATE
// router.put('/:petId', (req, res, next) => {
//   const petId = req.params.petId;
//   // Get the species value from the query parameters
//   const species = req.query.species;

//   // Merge the species field into the update data
//   const updateData = { ...req.body, species: species };

//   Cat.findByIdAndUpdate(petId, updateData, { new: true })
//   .then((catUpdate) => {
//     res.json({ success: true, catUpdate });
//   })
//   .catch((err) => {
//     res.json({ success: false, error: err });
//   });
// });


// // DELETE
// router.delete('/:petId', (req, res, next) => {
//   const petId = req.params.petId;
//   // Get the species value from the query parameters
//   const species = req.query.species;

//   Cat.findOneAndRemove({ _id: petId, species: species })
//   .then(() => {
//     res.json({ success: true, message: 'Successfully removed a pet' })
//   })
//   .catch((err) => {
//     res.json({ success: false, error: err });
//   });
// });

// module.exports = router;



// BEFORE DOGS
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Cat = require('../models/Cat.model');
const Location = require('../models/Location.model');

const uploadImage = require('../config/cloudinary.config')

// CREATE
router.post('/', uploadImage.array('images', 5), (req, res, next) => {
  console.log({ theFile: req.files });
  const { name, age, breed, gender, color, description, availability, dateOfEntry, location, } = req.body;
  const images = req.files.map(file => file.path);


  // Check if the provided location ID exists in the database
  Location.findById(location)
    .then(existingLocation => {
      if (!existingLocation) {
        return res.json({ success: false, error: "Location not found" });
      }

      // Create the cat or dog and associate it with the location
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
// router.put('/:catId', (req, res, next) => {

//   Cat.findByIdAndUpdate(req.params.catId, req.body, { new: true })
//   .then((catupdate) => {
//     res.json({ success: true, catupdate });
//   })
//   .catch((err) => {
//     res.json({ success: false, error: err });
//   });
// });

router.put('/:catId', (req, res, next) => {
  const { name, age, breed, gender, color, description, availability, dateOfEntry, location } = req.body;

  // Find the cat by ID
  Cat.findById(req.params.catId)
  .then((catToUpdate) => {
    catToUpdate.name = name;
    catToUpdate.age = age;
    catToUpdate.breed = breed;
    catToUpdate.gender = gender;
    catToUpdate.color = color;
    catToUpdate.description = description;
    catToUpdate.availability = availability;
    catToUpdate.dateOfEntry = dateOfEntry;
    catToUpdate.location = location;

      return catToUpdate.save();
  })
  .then((updatedCat) => {
    res.json({ success: true, catToUpdate: updatedCat });
  })
  .catch((err) => {
    res.json({ success: false, error: err });
  });
});

// UPDATE Images
router.patch('/:catId', uploadImage.array('images', 5), (req, res, next) => {
  console.log({ theFile: req.files });

  Cat.findById(req.params.catId)
  .then((catFromDB) => {
    console.log(catFromDB);
    req.files.forEach((file) => {
      catFromDB.images.push(file.path);
    });
    catFromDB.save()
    .then((updatedCat) => {
      console.log( {updatedCat} );
      res.status(200).json(updatedCat);
    })
    .catch((err) => res.status(400).json({ message: 'error pushing files:', err })
    );
  })
  .catch((err) => res.status(400).json({ message: 'error finding cat:', err })
  );
  
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
