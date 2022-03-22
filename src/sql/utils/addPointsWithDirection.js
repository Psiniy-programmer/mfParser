const addPointsWithDirection = async (points, dirName, dirGrade, client) => {
  const pointsIds = [];

  for (let i = 0; i < points.length; i++) {
    const {name, value, isOptional} = points[i];
    const q = {
      text: 'INSERT INTO POINTS (subjectname, value, isOptional) VALUES ($1,$2,$3) RETURNING id',
      values: [name, value, isOptional]
    }

    const queryResult = await client.query(q);
    pointsIds.push(...queryResult.rows);
  }

  const pointsIdsInArray = pointsIds.reduce((acc, cur, index) => {
    if (index === pointsIds.length - 1) {
      return acc + cur.id;

    } else {
      return acc + cur.id + ',';
    }
  }, '');

  console.log('points', pointsIdsInArray);

  return await client.query(`
      WITH InsertTable as (
        INSERT INTO Directions (
          name,
          pointsId,
          grade
        ) VALUES (
          '${dirName}', '{${pointsIdsInArray}}', '${dirGrade}'
        ) RETURNING code, pointsId
      )
      UPDATE Points set codeId = (
        SELECT code from InsertTable
      )
      WHERE Points.id = ANY(
        SELECT unnest(InsertTable.pointsId) from InsertTable
      ) RETURNING *
    `);
};

module.exports = {
  addPointsWithDirection
}
