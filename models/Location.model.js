const { Schema, model } = require('mongoose');

const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please use a valid 10-digit phone number.']
    },
    email: {
      type: String, 
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    openingHours: String,
    website: String,
    description: String,
    cats: [{ type: Schema.Types.ObjectId, ref: 'Cat' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
},
{
  timestamps: true,
}
);

const Location = model('Location', locationSchema);

module.exports = Location;