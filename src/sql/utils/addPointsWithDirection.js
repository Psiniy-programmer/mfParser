const addPointsWithDirection = async (points, dirName, client) => {
  const pointsIds = [];

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
          '${dirName}', '{${pointsIdsInArray}}'
        ) RETURNING code, pointsId
      )
      UPDATE Points set codeId = (
        SELECT code from InsertTable
      )
      WHERE Points.id = ANY(
        SELECT unnest(InsertTable.pointsId) from InsertTable
      ) RETURNING *
    `);

  return directionQuery;
};

module.exports = {
  addPointsWithDirection
}
