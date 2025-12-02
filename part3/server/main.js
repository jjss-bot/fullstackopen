import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import Person from './models/phonebook.js';

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => JSON.stringify(req.body));

function logFormat(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ');
}

app.use(morgan(logFormat));

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people);
    })
    .catch(error => next(error));
});

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.send(
        `<h2>Phonebook has info for ${people.length} people</h2><p>${Date()}</p>`);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons/', (request, response, next) => {
  const { name, phone } = request.body;

  const newPerson = new Person({ name, phone });

  return newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { phone } = request.body;

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }

      person.phone = phone;

      return person.save().then(updatedPerson => {
        response.json(updatedPerson);
      });
    })
    .catch(error => next(error));
});

// handler of requests with unknown endpoint
function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint ' });
}

app.use(unknownEndpoint);

// handler of requests with result to errors
function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(409).json({ error: 'name must be unique' });
  }

  next(error);
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});