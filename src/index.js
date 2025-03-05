import express, { request, response } from 'express';
import { PORT } from './constants/envs.mjs';
import { logger, unknownEndpoint } from './middlewares/common.middlewares.mjs';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(logger);
app.use(cors());

const persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (req = request, res = response) => {
  res.send(`
    <p>Phonebook has info for ${persons?.length} people</p>
    <p>${new Date().toString()}</p>
    `);
});

app.get('/api/persons', (req = request, res = response) => {
  res.json(persons);
});

app.post('/api/persons', (req = request, res = response) => {
  const payload = req.body;

  if (!payload?.name || !payload?.number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  const personIndex = persons.findIndex((p) => p.name === payload.name);

  if (personIndex !== -1) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  persons.push({
    ...payload,
    id: Math.ceil(Math.random() * 1000).toString(),
  });

  res.json(persons);
});

app.get('/api/persons/:id', (req = request, res = response) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  res.json(person);
});

app.delete('/api/persons/:id', (req = request, res = response) => {
  const id = req.params.id;
  const personIndex = persons.findIndex((p) => p.id === id);

  if (personIndex === -1) {
    return res.status(404).send('Person not found');
  }

  persons?.splice(personIndex, 1);

  res.send('Person deleted');
});

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
