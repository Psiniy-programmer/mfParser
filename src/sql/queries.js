const {addPointsWithDirection} = require("./utils/addPointsWithDirection");
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'd.ovdenko',
  host: 'localhost',
  database: 'testapi',
  password: 'kekPass',
  port: 5432,
})

const insertDirection = (req, res) => {
  const {code, pointsId, codeId} = req.body;

  pool.query(`INSERT INTO directions VALUES (${codeId}, '${code}', ${pointsId})`, (er, results) => {
    if (er) {
      console.error(er);
    }

    res.status(200).json(results);
  })
}

const getDirections = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query(`
      SELECT * FROM Directions 
    `, (er, results) => {
    if (er) {
      console.error(er);
    }

    res.status(200).json(results.rows);
  })
}

const getDirectionsById = (req, res) => {
  const id = parseInt(req.params.id)

  if (id) {
    pool.query(`
      SELECT * FROM Directions 
      WHERE code = ${id}
    `, (er, results) => {
      if (er) {
        console.error(er);
      }

      res.status(200).json(results.rows);
    })
  } else {
    res.status(400)
  }
}

const deleteDirections = (req, res) => {
  pool.query(`
      TRUNCATE TABLE Directions CASCADE
    `, (er) => {
    if (er) {
      console.error(er);
      res.status(400).send(er);
    }

    res.status(200).send('directions were deleted');
  })
}

const postSinglePointsWithDirection = async (req, res) => {
  const {name: directionName, points} = req.body;

  const client = await pool.connect()

  const singleQueryResult = await addPointsWithDirection(points, directionName, client);

  client.release();
  res.status(200).json(singleQueryResult.rows);
}

const postMultiplePointsWithDirections = async (req, res) => {
  const directionsArray = req.body;
  const client = await pool.connect()

  const directionsResult = [];

  for (let i = 0; i < directionsArray.length; i++) {
    const direction = directionsArray[i];

    const directionQueryResult = await addPointsWithDirection(direction.points, direction.name, direction.grade ?? '??', client);
    directionsResult.push(...directionQueryResult.rows);
  }

  client.release();

  console.log('direc', directionsResult);
  res.status(200).json(directionsResult);
}

const getPoints = (req, res) => {

  pool.query(`
      SELECT * FROM Points 
    `, (er, results) => {
    if (er) {
      console.error(er);
    }

    res.status(200).json(results.rows);
  })

}

module.exports = {
  insertDirection,
  getDirections,
  getDirectionsById,
  deleteDirections,
  postPointWidthDirection: postSinglePointsWithDirection,
  postMultiplePointsWithDirections,
  getPoints
}
