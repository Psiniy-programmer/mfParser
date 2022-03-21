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

const postPointWidthDirection = async (req, res) => {
  const {name: directionName, points} = req.body;
  // const id = parseInt(req.params.id);
  const pointsIds = [];

  await (async function () {
    const client = await pool.connect()

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const queryResult = await client.query(`
      INSERT INTO Points (
        subjectName, value, isOptional
      ) VALUES (
        ${point.name}, '${point.value}', ${point.isOptional}
      ) RETURNING id;
    `)
      pointsIds.push(...queryResult.rows);
    }

    const pointsIdsInArray = pointsIds.reduce((acc, cur, index) => {
      if (index === pointsIds.length - 1) {
        return acc + cur.id;

      } else {
        return acc + cur.id + ',';
      }
    }, '');


    const directionQuery = await client.query(`
      WITH InsertTable as (
        INSERT INTO Directions (
          name,
          pointsId
        ) VALUES (
          '${directionName}', '{${pointsIdsInArray}}'
        ) RETURNING code, pointsId
      )
      UPDATE Points set codeId = (
        SELECT code from InsertTable
      )
      WHERE Points.id = ANY(
        SELECT unnest(InsertTable.pointsId) from InsertTable
      )
    `);
    client.release();
    res.status(200).json(directionQuery.rows);
  })()
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
  postPointWidthDirection,
  getPoints
}
