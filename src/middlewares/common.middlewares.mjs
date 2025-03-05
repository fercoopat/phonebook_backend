import { request, response } from 'express';
import morgan from 'morgan';

export const unknownEndpoint = (req = request, res = response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '-';
});

export const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :req-body'
);
