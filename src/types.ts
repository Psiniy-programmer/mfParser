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
