const { Schema, model } = require('mongoose');

const catSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Date, required: true },
    breed: String,
    gender: { type: String, enum: ['Male', 'Female', 'Unknown'], required: true },
    color: String,
    description: String,
    availability: { type: String, enum: ['Available', 'Adopted', 'Pending'], default: 'Available' },
    images: [{ type: String, required: true }],
    dateOfEntry: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
},
{
  timestamps: true,
}
);

const Cat = model('Cat', catSchema);

module.exports = Cat;
