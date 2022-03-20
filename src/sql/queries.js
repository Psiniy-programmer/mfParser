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

const putPointsInDirection = (req, res) => {
  const id = parseInt(req.params.id);
  console.log('req', req.body);
  // if (id) {
  const resIds = req.body.map((point) => {
      pool.query(`
      INSERT INTO Points (
        subjectName, value, isOptional
      ) VALUES (
        ${point.name}, '${point.value}', ${point.isOptional}
      ) RETURNING id;
    `, (err, result) => {
        if (err) {
          console.error(err);
          res.status(400).send(err);
        }

        console.log('res', result.rows);
        return result.rows;
      })
    })
    // pool.query(`
    //   UPDATE Directions SET (${code}, ${pointsId})
    // `)

    res.status(200).json(resIds);
  // }
}

module.exports = {
  insertDirection,
  getDirections,
  getDirectionsById,
  deleteDirections,
  putPointsInDirection
}
