<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline teal--text">Sign in</div>
        </v-layout>
        <v-form @submit.prevent="login">
            
            <v-alert v-model="alert"
                type="error" 
                dismissible
                transition="scale-transition" 
                outline>
                {{ message }}
            </v-alert>

            <v-text-field
                prepend-inner-icon="person"
                v-model="email"
                :rules="[v => !!v || 'E-mail is required',
                        v => /.+@.+/.test(v) || 'E-mail must be valid']"
                label="E-mail"
                required/>

            <v-text-field
                prepend-inner-icon="lock"
                v-model="password"
                :rules="[v => !!v || 'Password is required']"
                label="Password"
                required/>

            <v-layout class="py-3" justify-end>
                <v-btn type="submit" 
                    flat color="teal"
                    :loading="loading" 
                    @click="login">Login</v-btn>
            </v-layout>
                
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { bus } from '@/main'
import users from '@/store/modules/users'
import { User } from '@/models/User'
import BackendService from '@/services/backendService'
const backendService = new BackendService()

@Component
export default class Login extends Vue {
    email: string = ''
    password: string = ''
    message: string = ''
    alert: boolean = false
    loading: boolean = false

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

    login() {
        let data = {
            email: this.email,
            password: this.password
        }
        this.loading = true
        
        backendService
        .signin(data)
        .then(() => this.loading = false)
    }
}

</script>
