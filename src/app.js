const express = require('express');
const app = express();

const morgan = require('morgan');
const { unknownEndpoint } = require('./middlewares/unknown-endpoint');
const { requestLogger } = require('./middlewares/request-logger');
const { Person } = require('./models/person.model');
const { errorHandler } = require('./middlewares/error-handler');

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(requestLogger));

app.get('/api/info', (req, res) => {
  return Person.find({}).then((persons) => {
    return res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `);
  });
});

app.get('/api/persons', (req, res, next) => {
  return Person.find({})
    .then((persons) => {
      return res.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  return Person.findById(id)
    .then((person) => {
      if (person) {
        return res.json(person);
      }
      return res.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/persons', (req, res, next) => {
  const payload = req.body;
  if (!payload?.name) {
    return res.status(400).json({ error: 'Need to provide a name!' });
  }
  if (!payload?.number) {
    return res.status(400).json({ error: 'Need to provide a number!' });
  }
  const newPerson = new Person(payload);
  return newPerson
    .save()
    .then((savedPerson) => {
      return res.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const payload = req.body;
  return Person.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((person) => {
      if (person) {
        return res.json(person);
      }
      return res.status(404).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  return Person.findByIdAndDelete(id)
    .then(() => {
      return res.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = { app };
