<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline primary--text">Sign in</div>
        </v-layout>
        <v-form @submit.prevent="login">
            <v-alert v-model="alert" type="error" dismissible outline>
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
                    flat color="primary"
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
import { api, setJWT } from '@/store/api'
import { User } from '@/models/User'

@Component
export default class Login extends Vue {
    email: string = ''
    password: string = ''
    message: string = ''
    alert: boolean = false
    loading: boolean = false

    login() {
        this.loading = true

        api.post('/login', {
            email: this.email,
            password: this.password
        })
        .then(response => {
            users.login(response.data as User)
            bus.$emit('loggedIn')
        })
        .catch(err => {
            this.alert = true
            this.message = 'Invalid Email or Password'
        })
        .then(() => {
            this.loading = false
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }
}

</script>
