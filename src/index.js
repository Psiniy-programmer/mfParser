const express = require('express')
const bodyParser = require('body-parser')
const db = require('./sql/queries')
const {mockedInsertDirection} = require("./sql/queries");

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  // mockedInsertDirection();
  response.json({info: 'Node.js, Express, and Postgres API'})
})

app.post('/direction', db.insertDirection);
app.get('/direction', db.getDirections);
app.get('/direction/:id', db.getDirectionsById);
app.delete('/direction', db.deleteDirections);
app.put('/direction', db.putPointsInDirection)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
