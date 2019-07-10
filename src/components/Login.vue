<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline">
                {{ restoreMode ? 'Password Restore' : 'Sign in' }}
            </div>
        </v-layout>
        <v-form @submit.prevent="login">
            
            <v-alert v-model="alert"
                outline
                type="error" dense 
                dismissible>
                {{ message }}
            </v-alert>

            <v-text-field
                prepend-icon="mail"
                v-model="email"
                :rules="[v => !!v || 'Email is required']"
                label="Email"
                required/>

            <v-text-field
                v-if="!restoreMode"
                prepend-icon="lock"
                v-model="password"
                type="password"
                :rules="[v => !!v || 'Password is required']"
                label="Password"
                required/>

            <v-layout align-center justify-space-between>
                <v-checkbox v-model="remember"
                    v-if="!restoreMode"
                    color="primary"
                    label="Remember me"/>
                <div class="text-xs-right primary--text px-2">
                    <a href="#passwordRestore"
                        class="link"
                        @click="restorePassword">
                        {{ restoreMode ? 'Back' : 'Forgot Password?' }}</a>
                </div>
            </v-layout>

            <v-layout class="py-3" justify-end>
                <v-btn type="submit"
                    v-if="!restoreMode" 
                    dark color="blue-grey"
                    :loading="loading">
                        Login
                        <v-icon class="ml-1" small>exit_to_app</v-icon>
                    </v-btn>
                <v-btn v-if="restoreMode" 
                    color="blue-grey" dark
                    :loading="loading" 
                    @click.prevent="send">Send</v-btn>
            </v-layout>
                
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { bus } from '@/main'
import users from '@/store/modules/users'
import { User } from '@/models/User'
import BackendService from '@/services/backend'
const backendService = new BackendService()

@Component
export default class Login extends Vue {
    email: string = ''
    password: string = ''
    message: string = ''
    alert: boolean = false
    loading: boolean = false
    restoreMode: boolean = false
    remember: boolean = false

    created() {
        bus.$on('notify', (message: string) => {
            this.alert = true
            this.message = message
        })
    }

    async login() {
        if(!this.restoreMode) {

            if(this.email && this.password) {
                let data = {
                    Email: this.email,
                    Password: this.password,
                    Remember: this.remember
                }
                
                try {
                    this.loading = true
                    await backendService.signin(data)
                }
                catch (e) {
                    console.log(e)
                }
                finally {
                    this.loading = false
                }
            }
            else {
                this.alert = true
                this.message = 'Input Email and Password'
            }
            
        }
        else {
            this.send()
        }
    }

    restorePassword() {
        this.restoreMode = !this.restoreMode
    }

    send() {
        this.loading = true
        backendService
        .passwordRestore(this.email)
        .then(() => {
            this.loading = false
            setTimeout(() => {
                this.restoreMode = false
                this.email = ''
            }, 3000)
        })
    }
}

</script>

<style lang="scss">
.link {
    cursor: pointer;
    text-decoration: none;
}
</style>
