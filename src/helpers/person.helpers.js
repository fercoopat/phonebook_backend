const { persons } = require('../data/persons');

function personAlreadyExists(name) {
  return !!persons.find((person) => person.name === name);
}

module.exports = { personAlreadyExists };
