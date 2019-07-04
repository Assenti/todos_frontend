<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline teal--text">Sign up</div>
        </v-layout>
        <v-form @submit.prevent="submit">

            <v-alert v-model="alert"
                dismissible
                type="error"
                transition="scale-transition" 
                outline>
                {{ message }}
            </v-alert>

            <v-text-field 
                prepend-inner-icon="person"
                v-model="firstname"
                label="Firstname"
                v-validate="'required'"
                data-vv-name="Firstname"
                :error-messages="errors.collect('Firstname')"
                required/>

            <v-text-field
                prepend-inner-icon="person"
                v-model="lastname"
                v-validate="'required'"
                data-vv-name="Lastname"
                :error-messages="errors.collect('Lastname')"
                label="Lastname"
                required/>

            <v-text-field
                prepend-inner-icon="email"
                v-model="email"
                v-validate="'required|email'"
                data-vv-name="Email"
                :error-messages="errors.collect('Email')"
                label="Email"
                required/>

            <v-text-field
                prepend-inner-icon="lock"
                v-model="prePassword"
                v-validate="'required'"
                data-vv-name="PrePassword"
                :error-messages="errors.collect('PrePassword')"
                label="Password"
                type="password"
                required/>
            
            <v-text-field
                prepend-inner-icon="lock"
                v-model="password"
                v-validate="'required'"
                data-vv-name="Password"
                :error-messages="errors.collect('Password')"
                label="Repeat Password"
                type="password"
                required/>
            
            <v-layout class="py-3">
                <v-spacer></v-spacer>
                <v-btn flat 
                    color="teal"
                    :loading="loading"
                    type="submit" 
                    @click="submit">
                    <v-icon small class="mr-1">person_add</v-icon>
                    Register
                </v-btn>
            </v-layout>
                
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import users from '@/store/modules/users'
import BackendService from '@/services/backend'
const backendService = new BackendService()
import { User } from '../models/User'
import { bus } from '@/main'

@Component
export default class Register extends Vue {
    firstname: string = ''
    lastname: string = ''
    email: string = ''
    password: string = ''
    prePassword: string = ''
    message: string = ''
    alert: boolean = false
    loading: boolean = false

    created() {
        bus.$on('notify', (message: string) => {
            this.message = message
            this.alert = true
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }

    comparePassword(): boolean {
        if(this.password !== this.prePassword) {
            this.alert = true
            this.message = `Password doesn't same`
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
            return false
        }
        else {
            return true
        }
    }

    submit() {
        this.$validator
        .validateAll()
        .then(result => {
            if(result) {
                if(this.comparePassword()) {
                    this.loading = true
                    this.signUp()
                } 
                return
            }
            this.alert = true
            this.message = 'Fill all required fields, please'
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }

    signUp() {
        let newUser = {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password
        }

        backendService
        .register(newUser as User)
        .then(() => this.loading = false)  
        .catch(err => console.log(err))
    }
}

</script>
