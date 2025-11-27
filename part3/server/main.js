import cors from 'cors'
import express from 'express'
import morgan, { token } from 'morgan'

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(logFormat));

morgan.token('body', (req, res) => JSON.stringify(req.body));

function logFormat(tokens, req, res) {
    return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}

let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(people);
});

app.get('/info', (request, response) => {
    const size = people.length;
    const date = Date();

    response.send(
        `<h2>Phonebook has info for ${size} people</h2><p>${date}</p>`
    );
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = people.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    people = people.filter(person => person.id !== id);
    response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
    const newPerson = {'name': request.body.name,
                       'phone': request.body.phone };

    if (!(newPerson.name) || newPerson.name.length === 0) {
        response.status(400).json({error: 'name is missing'});
        return;
    }

    if (!(newPerson.phone) || newPerson.phone.length === 0) {
        response.status(400).json({error: 'phone number is missing'});
        return;
    }

    const person = people.find(p => p.name === newPerson.name);
    
    if (person) {
        response.status(409).json({error: 'name must be unique'});
        return;
    }
    
    // Add id to new entry
    newPerson.id = Math.round(Math.random() * 100000).toString();

    people = people.concat(newPerson);
    response.json(newPerson);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});