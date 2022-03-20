export type Subject = {
	name?: string,
	value: number | null,
	position: number,
	isOptional: boolean
}

export type Direction = {
	name?: string,
	code: string,
	points: Subject[],
	grade?: string,
	pageNumber: number
}

export type Table = Direction[]

// CREATE TABLE Directions (
// 	code var PRIMARY KEY,
// 	name varchar,
// 	pointsId int
// );
//
// CREATE TABLE Points (
// 	id SERIAL PRIMARY KEY,
// 	codeId INTEGER REFERENCES Directions (code),
// 	subjectName varchar,
// 	value varchar,
// 	isOptional boolean
// );
