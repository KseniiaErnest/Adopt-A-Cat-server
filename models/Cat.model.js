const { Schema, model } = require('mongoose');

const catSchema = new Schema(
  {
    name: { type: String },
    age: { type: Date },
    breed: String,
    gender: { type: String, enum: ['Male', 'Female', 'Unknown'] },
    color: String,
    description: String,
    availability: { type: String, enum: ['Available', 'Adopted', 'Pending'] },
    images: [{ type: String}],
    dateOfEntry: { type: Date },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    // species: { type: String, enum: ['Cat', 'Dog']},
},
{
  timestamps: true,
}
);

const Cat = model('Cat', catSchema);

module.exports = Cat;
