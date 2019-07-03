<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline teal--text">
                {{ restoreMode ? 'Password Restore' : 'Sign in' }}
            </div>
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
                :rules="[v => !!v || 'Email is required',
                        v => /.+@.+/.test(v) || 'E-mail must be valid']"
                label="Email"
                required/>

            <v-text-field
                v-if="!restoreMode"
                prepend-inner-icon="lock"
                v-model="password"
                type="password"
                :rules="[v => !!v || 'Password is required']"
                label="Password"
                required/>

            <v-layout align-center justify-space-between>
                <v-checkbox v-model="remember"
                    color="teal"
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
                    flat color="teal"
                    :loading="loading" 
                    @click="login">Login</v-btn>
                <v-btn v-if="restoreMode" 
                    flat color="teal"
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
import BackendService from '@/services/backendService'
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
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }

    async login() {
        if(!this.restoreMode) {
            let data = {
                email: this.email,
                password: this.password,
                remember: this.remember
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
