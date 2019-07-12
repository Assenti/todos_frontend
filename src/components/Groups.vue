<template>
    <v-card min-height="200">
        <v-card-title class="subheading blue-grey white--text">
            <v-icon small left color="white">group</v-icon>
            Create group/project
        </v-card-title>

        <v-card-text>
            
            <v-text-field v-model="groupName"
                persistent-hint
                hint="Create group/project name"
                label="Group/project name"
                prepend-icon="group"/>

            <v-alert v-model="alert"
                outline
                :type="status" dense 
                dismissible>
                {{ message }}
            </v-alert>

            <v-layout>
                <v-spacer/>
                <v-btn color="primary" 
                    :loading="loading"
                    flat @click="createGroup">
                    create
                    <v-icon class="ml-1" small>add_box</v-icon>
                </v-btn>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Group, GroupParticipant } from '@/models/Group'
import { api } from '@/store/api'
import { bus } from '@/main'
import users from '@/store/modules/users'

@Component({})
export default class Groups extends Vue {
    search: string | null = ''
    group?: Group
    groupName: string = ''
    loading: boolean = false
    preloader: boolean = false
    alert: boolean = false
    message: string = ''
    status: string | undefined = 'error'

    async createGroup() {
        if(this.groupName) {
            const payload = {
                Name: this.groupName,
                UserID: users.userId
            }

            try {
                this.loading = true
                await api.post(`api/group`, payload)
                this.alert = true
                this.message = 'Group/project successfully created'
                this.status = 'success'
            }
            catch (e) {
                console.log(e)
                this.alert = true
                this.status = 'error'
                this.message = 'Error ocurred while creating group/project'
            }
            finally {
                this.loading = false
            }
        }
    }
}
</script>
