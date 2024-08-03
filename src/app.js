const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { persons } = require('./data/persons');

const { getRandomNumber } = require('./helpers/math.helpers');
const { personAlreadyExists } = require('./helpers/person.helpers');
const { unknownEndpoint } = require('./middlewares/unknown-endpoint');
const { requestLogger } = require('./middlewares/request-logger');

const app = express();

app.use(express.json());
app.use(morgan(requestLogger));
app.use(cors());
app.use(express.static('dist'));

app.get('/info', (req, res) => {
  return res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.get('/api/persons', (req, res) => {
  return res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const person = persons?.find((person) => person.id === id);
  if (!person) {
    return res.status(404).end();
  }
  return res.json(person);
});

app.post('/api/persons', (req, res) => {
  const payload = req.body;
  if (!payload?.number) {
    return res.status(400).json({ error: 'Need to provide a number!' });
  }
  if (!payload?.name) {
    return res.status(400).json({ error: 'Need to provide a name!' });
  }
  if (personAlreadyExists(payload?.name)) {
    return res.status(400).json({ error: 'Person already exist!' });
  }
  const newPerson = { ...payload, id: getRandomNumber() };
  persons.push(newPerson);
  return res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const personIndex = persons?.findIndex((person) => person.id === id);
  if (personIndex !== -1) {
    persons.splice(personIndex, 1);
    return res.status(204).end();
  }
  return res.status(404).end();
});

app.use(unknownEndpoint);

module.exports = { app };
