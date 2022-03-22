

WITH updated AS (
    SELECT * FROM directions
    )
UPDATE Directions set name = 'new fckng name'
WHERE Directions.code IN (
       SELECT updated.code from updated
       LEFT JOIN directions ON directions.code = updated.code
) RETURNING *;
SELECT * from directions
;
