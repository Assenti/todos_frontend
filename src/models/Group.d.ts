export interface Group {
    id: number
	name: string 
	createdAt: number
	userId: number
}

export interface GroupParticipant {
    id: number
	userId: number
	groupId: number
}