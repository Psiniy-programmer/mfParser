
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./sql/queries')
const {mockedInsertDirection} = require("./sql/queries");
const cors = require("cors");

const app = express();
const SERVER_PORT = 3042;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors());


app.get('/', (request, response) => {
  // mockedInsertDirection();
  response.json({info: 'Node.js, Express, and Postgres API'})
})

// app.post('/direction', db.insertDirection);
app.get('/direction', db.getDirections);
app.get('/direction/:id', db.getDirectionsById);
app.delete('/direction', db.deleteDirections);
app.post('/direction', db.postPointWidthDirection);
app.post('/directions', db.postMultiplePointsWithDirections);

app.get('/points', db.getPoints);

app.listen(SERVER_PORT, () => {
  console.log(`App running on port ${SERVER_PORT}.`)
})
