const Pool = require('pg').Pool
const pool = new Pool({
  user: 'd.ovdenko',
  host: 'localhost',
  database: 'testapi',
  password: 'kekPass',
  port: 5432,
})

const insertDirection = (req, res) => {
  const {code, pointsId, codeId} = req;

  pool.query(`INSERT INTO directions VALUES (${codeId}, ${code}, ${pointsId})`, (er, results) => {
    if (er) {
      throw er;
    }

    res.status(200).json(results.rows);
  })
}

const mockedInsertDirection = () => {
  const code = '03.27.91';
  const codeId = 2;
  const pointsId = 3;

  pool.query(`INSERT INTO directions VALUES (${codeId}, '${code}', ${pointsId})`, (er, results) => {
    if (er) {
      throw er;
    }

  })
}

module.exports = {
  insertDirection,
  mockedInsertDirection
}
