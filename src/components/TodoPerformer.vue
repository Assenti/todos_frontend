<template>
    <v-card min-height="300">
        <v-card-title class="subheading">
            <v-icon small left>person</v-icon>
            Set todo performer
        </v-card-title>
        <v-card-text>
            
            <v-autocomplete
                v-model="performer"
                :items="performers"
                :loading="preloader"
                :rules="[v => !!v || 'Required']"
                :search-input.sync="search"
                dense clearable
                hide-no-data
                hide-selected
                label="Performer"
                persistent-hint
                hint="Start typing to search performer"
                prepend-icon="search">
                <template v-slot:selection="{ item }">
                    {{ item.firstname }} {{ item.lastname }}
                </template>
                <template v-slot:item="{ item }">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <v-layout align-center justify-space-between>
                                <div>{{ item.firstname }} {{ item.lastname }}</div>
                                <v-chip class="ma-0 pa-0" 
                                    color="info" 
                                    outline small>{{ item.email }}</v-chip>
                            </v-layout>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </template>
            </v-autocomplete>

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
                    flat @click="setPerformer">
                    Save
                    <v-icon class="ml-1" small>save</v-icon>
                </v-btn>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Performer } from '@/models/User'
import { Todo } from '@/models/Todo'
import { api } from '@/store/api'
import { bus } from '@/main'
import users from '@/store/modules/users'

@Component({})
export default class TodoPerformer extends Vue {
    search: string | null = ''
    performer?: Performer
    loading: boolean = false
    preloader: boolean = false
    performers: Performer[] = []
    alert: boolean = false
    message: string = ''
    status: string | undefined = 'error'

    @Prop({type: Object as () => Todo})
    public todo!: Todo

    mounted() {
        if(this.performers.length == 0) this.getUsers()   
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

    async setPerformer() {
        if(this.performers.length > 0) {
            try {
                this.loading = true
                await api.get(`api/todoPerformer?todoId=${this.todo.id}&userId=${this.performer!.id}`)
                this.alert = true
                this.message = 'Performer successfully set'
                this.status = 'success'
            }
            catch (e) {
                console.log(e)
                this.alert = true
                this.status = 'error'
                this.message = 'Error ocurred while setting performer'
            }
            finally {
                this.loading = false
            }
        }
    }
}
</script>
