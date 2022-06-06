const { request } = require('express')
const express = require('express')
const req = require('express/lib/request')
const app = express()
var morgan = require('morgan')

/******** Get thangs goin' ********/
app.use(express.json())
app.use(morgan('tiny'))

/******** I do declare, it is X o'clock ********/
let date_time = new Date()

/******** The Phonebook *********/
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
    ]

/********** ID Generator *********/
const generateId = () => {
  const maxId =  persons.length > 0
  ? Math.max(...persons.map(n => n.id))
  : 0

  return maxId + 1
}

/********** Static Pages *********/
app.get('/', (request, response) => {
    response.send('<h1>Visit /api/persons to see the phonebook, or /info to check the phonebook stats!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people.` + '\n' + `${date_time}`)
})

/********** /api/persons stuff **********/
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('api/persons', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/************ Unknown Endpoint **********/
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/********* Hey! Listen! ********/
const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})