export interface Group {
    id: number
	name: string 
	createdAt: number
	userId: number
	participate: boolean
}

export interface GroupParticipant {
    id: number
	userId: number
	groupId: number
	firstname: string
	lastname: string
}

export interface AllGroups {
	groups: Group[]
	groupsIn: Group[]
}