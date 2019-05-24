<template>
      <v-card class="pa-2">
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text class="px-4">

            <v-alert v-model="alert"
                type="error"
                class="mx-2" 
                dismissible
                transition="scale-transition" 
                outline>
                {{ message }}
            </v-alert>

            <v-text-field
                prepend-inner-icon="lock"
                v-model="password"
                :loading="loader"
                :readonly="correctPassword"
                @change="checkPassword" 
                label="Current Password"
                required>
                <template v-if="correctPassword" slot="append">
                    <v-icon color="green">check</v-icon>
                </template>
            </v-text-field>

            <v-text-field
                prepend-inner-icon="lock"
                v-model="newPassword" 
                label="New Password" 
                required/>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" flat @click="close">Close</v-btn>
          <v-btn color="primary" 
            flat :loading="loading"
            :disabled="!correctPassword" 
            @click="change">Save</v-btn>
        </v-card-actions>

      </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backendService'
import { bus } from '@/main'
import { User } from '../models/User'
const backendService = new BackendService()

@Component({
  components: {
    
  }
})
export default class Todos extends Vue {
    dialog: boolean = false
    alert: boolean = false
    message: string = ''
    loader: boolean = false
    loading: boolean = false
    password: string = ''
    newPassword: string = ''
    correctPassword: boolean = false

    created() {
        bus.$on('notify', (message: string) => {
            this.alert = true
            this.message = message
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }
  
    mounted() {
    }

    checkPassword() {
        this.loader = true
        let data = {
            ID: users.userId,
            Email: users.userEmail,
            Password: this.password
        }
        backendService
        .passwordCheck(data as User)
        .then(() => {
            this.loader = false
            this.correctPassword = true
        })
    }

    change() {
        this.loading = true
        let data = {
            ID: users.userId,
            Email: users.userEmail,
            Password: this.newPassword
        }
        backendService
        .passwordChange(data as User)
        .then(() => {
            this.loading = false
        })
    }

    close() {
        bus.$emit('closeAccount')
    }
}
</script>
