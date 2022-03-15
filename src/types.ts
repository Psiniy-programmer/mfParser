export type Subject = {
	name: string,
	value: number | null
}

export type Direction = {
	name: string,
	code: string,
	points: Subject[],
	grade: string
}

export type Table = Direction[]
