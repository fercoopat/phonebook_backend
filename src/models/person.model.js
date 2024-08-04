const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        const parts = v.split('-');
        if (parts.length !== 2) {
          return false;
        }
        const firstPart = parts[0];
        const secondPart = parts[1];
        if (firstPart.length !== 2 && firstPart.length !== 3) {
          return false;
        }
        if (!/^\d+$/.test(firstPart) || !/^\d+$/.test(secondPart)) {
          return false;
        }
        return v.length >= 8;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
});

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PERSON_COLLECTION = 'Person';

const Person = mongoose.model(PERSON_COLLECTION, PersonSchema);

module.exports = { PERSON_COLLECTION, Person };
