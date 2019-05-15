<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline primary--text">Sign in</div>
        </v-layout>
        <v-form>
            <v-alert v-model="alert" type="error" outline>
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
                <v-btn flat color="primary" @click="login">Login</v-btn>
            </v-layout>
                
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import users from '@/store/modules/users'
import { api, setJWT } from '@/store/api'
import { User } from '@/models/User'

@Component
export default class Login extends Vue {
    email: string = ''
    password: string = ''
    message: string = ''
    alert: boolean = false

    login() {
        users.login({
            email: this.email,
            password: this.password,
        })
        .then(() => {
            console.log('ok')
        })
        .catch((err) => {
            console.log(err)
            this.alert = true
            this.message = 'Invalid login or password'
        })
    }
}

</script>
