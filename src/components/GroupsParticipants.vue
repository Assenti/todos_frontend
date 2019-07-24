<template>
    <v-card min-height="300">
        <v-card-title class="blue-grey white--text">
            <v-icon left dark>group</v-icon>
            Group/project participants
        </v-card-title>

        <v-card-text>
            <v-alert v-model="alert"
                border="left" text
                :type="status" 
                dismissible>
                {{ message }}
            </v-alert>

            <div class="caption">Your groups/projects or groups/projects that you are participate</div>
            <v-progress-linear
                v-if="loading"
                indeterminate
                color="teal"
                height="2"
                value="15"/>
                
            <v-list dense>
                <v-list-group
                    v-for="(g, i) in groups"
                    :key="`group-${i}`"
                    v-model="g.active"
                    @click="getParticipants(g)"
                    no-action>
                    <template v-slot:activator>
                        
                        <v-list-item-content>
                            <v-list-item-title>
                                <strong 
                                    :title="`created at: ${new Date(g.createdAt).toISOString().substr(0, 10) }`">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-icon small v-on="on"
                                                v-if="g.participate" 
                                                class="mr-1">info_outline</v-icon>
                                        </template>
                                        <span>Group/project that you are participate</span>
                                    </v-tooltip>
                                    {{ g.name }}
                                </strong>
                            </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-menu bottom left open-on-hover offset-y min-width="250"> 
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon text small
                                            v-if="!g.participate" 
                                            title="Add participant"
                                            v-on="on">
                                            <v-icon small>more_vert</v-icon>
                                        </v-btn>
                                    </template>

                                    <v-list dense class="py-0">
                                        <v-list-item v-for="(p, i) in performers" :key="i"
                                            @click="voidFunc">
                                            <v-list-item-content>
                                                <v-list-item-title v-text="`${p.firstname} ${p.lastname}`"/>
                                            </v-list-item-content>

                                            <v-list-item-action>
                                                <v-btn @click="addParticipant(g, p)"
                                                    text icon small
                                                    title="Add a participant"
                                                    color="primary">
                                                    <v-icon small>person_add</v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list>

                                </v-menu>
                        </v-list-item-action>
                    </template>
                    
                    <v-list-item @click="voidFunc"> 
                        <v-list-item-content>
                            <v-list-item-title v-for="(participant, i) in participants" :key="i">
                                 <v-layout align-center justify-space-between>
                                    <div>
                                        <v-icon small left>person</v-icon>
                                        {{ participant.firstname }} {{ participant.lastname }}
                                    </div>
                                    <div>
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon text small v-on="on"
                                                    :disabled="g.participate" color="red"
                                                    @click="removeParticipant(participant, i)">
                                                    <v-icon small>remove</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Remove participant from group/project</span>
                                        </v-tooltip>
                                    </div>
                                </v-layout>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    
                </v-list-group>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Performer } from '@/models/User'
import { Todo } from '@/models/Todo'
import { Group, GroupParticipant, AllGroups } from '../models/Group'
import { api } from '@/store/api'
import { bus } from '@/main'
import BackendService from '@/services/backend'
const backendService = new BackendService()
import users from '@/store/modules/users'

@Component({})
export default class GroupParticipants extends Vue {
    search: string | null = ''
    performer?: Performer
    loading: boolean = false
    preloader: boolean = false
    performers: Performer[] = []
    groups: Group[] = []
    participants: GroupParticipant[] = []
    alert: boolean = false
    message: string = ''
    status: string | undefined = 'error'

    mounted() {
        this.getUsers()
        this.getGroups()   
    }

    async getUsers() {
        try {
            this.preloader = true
            const { data } = await api.get('/api/users')
            this.performers = data.users
        }
        catch (e) {
            console.log(e)
            this.alert = true
            this.status = 'error'
            this.message = 'Error ocurred while fetching performers list'
        }
        finally {
            this.preloader = false
        }
    }

    async getGroups() {
        try {
            this.loading = true
            const result = await backendService.getAllGroups()
            let allGroups: Group[]

            if(result.groups.length > 0 || result.groupsIn.length > 0) {
                allGroups = result.groups.length > 0 ?
                result.groups.concat(result.groupsIn) :
                result.groupsIn.concat(result.groups)
                this.groups = allGroups
            }
            else {
                this.alert = true
                this.status = 'info'
                this.message = 'You have no groups/projects'
                this.groups = []
            }
        }
        catch (e) {
            console.log(e)
            this.alert = true
            this.status = 'error'
            this.message = 'Error occurred while fetching groups'
            this.groups = []
        }
        finally {
            this.loading = false
        }
    }

    async getParticipants(group: Group) {
        if(this.participants.length == 0) {
            try {
                const { data } = await api.get(`/api/participants?groupid=${group.id}`)
                this.participants = data.participants
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    async addParticipant(group: Group, user: Performer) {
        try {
            const { data } = await api.get(`/api/addParticipant?groupid=${group.id}&userid=${user.id}`)
            this.participants = data.participants
        }
        catch (e) {
            console.log(e)
        }
    }

    async removeParticipant(participant: GroupParticipant, index: number) {
        console.log(participant, index)
    }

    voidFunc(){}
}
</script>
