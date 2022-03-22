WITH test as (
    SELECT * from Directions
)
UPDATE Directions set name = 'fck'
WHERE Directions.code IN (
    SELECT test.code from test
    LEFT JOIN Directions ON Directions.code = test.code
) RETURNING *
;