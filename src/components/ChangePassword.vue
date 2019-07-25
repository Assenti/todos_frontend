<template>
    <v-card flat>
        <v-card-title class="blue-grey white--text">
            <v-icon left color="white">lock</v-icon>
            Change password
        </v-card-title>

        <v-card-text class="pt-2 px-3">

            <v-alert v-model="alert"
                :type="type"
                dismissible dense
                border="left"
                colored-border
                class="grey lighten-4">
                {{ message }}
            </v-alert>

            <v-text-field
                prepend-icon="lock"
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
                prepend-icon="lock"
                v-model="newPassword" 
                label="New Password" 
                required/>
            <v-layout>
                <v-spacer/>
                <v-btn color="blue-grey" 
                dark depressed :loading="loading"
                :disabled="!correctPassword" 
                @click="change">
                    Save
                    <v-icon class="ml-1" small>save</v-icon>
                </v-btn>
            </v-layout>

        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { bus } from '@/main'
import { User } from '../models/User'
const backendService = new BackendService()

@Component({
  components: {
    
  }
})
export default class ChangePassword extends Vue {
    alert: boolean = false
    message: string = ''
    type: string = 'success'
    loader: boolean = false
    loading: boolean = false
    password: string = ''
    newPassword: string = ''
    correctPassword: boolean = false

    async checkPassword() {
        this.loader = true
        let data = {
            id: users.userId,
            email: users.userEmail,
            password: this.password
        }
        try {
            await backendService.passwordCheck(data as User)
            this.correctPassword = true
            this.alert = true
            this.type = 'success'
            this.message = 'Password successfully checked'
        }
        catch (e) {
            this.correctPassword = false
            this.alert = true
            this.type = 'error'
            this.message = e
        }
        finally {
            this.loader = false
        }
    }

    async change() {
        this.loading = true
        let data = {
            id: users.userId,
            email: users.userEmail,
            password: this.newPassword
        }
        try {
            await backendService.passwordChange(data as User)
            this.alert = true
            this.type = 'success'
            this.message = 'New password was generated! Check your Email, please'
        }
        catch (e) {
            this.alert = true
            this.type = 'error'
            this.message = e
        }
        finally {
            this.loading = false
        }
    }

    close() {
        bus.$emit('closeAccount')
    }
}
</script>
