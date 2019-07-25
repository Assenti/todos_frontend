<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline">Sign up</div>
        </v-layout>
        <v-form @submit.prevent="submit">

            <v-alert v-model="alert"
                dismissible text
                :type="status"
                border="left">
                {{ message }}
            </v-alert>

            <v-text-field 
                prepend-icon="person"
                v-model="firstname"
                label="First name"
                v-validate="'required'"
                data-vv-name="Firstname"
                :error-messages="errors.collect('Firstname')"
                required/>

            <v-text-field
                prepend-icon="person"
                v-model="lastname"
                v-validate="'required'"
                data-vv-name="Lastname"
                :error-messages="errors.collect('Lastname')"
                label="Last name"
                required/>

            <v-text-field
                prepend-icon="email"
                v-model="email"
                v-validate="'required|email'"
                data-vv-name="Email"
                :error-messages="errors.collect('Email')"
                label="Email"
                required/>

            <v-text-field
                prepend-icon="lock"
                v-model="prePassword"
                v-validate="'required'"
                data-vv-name="PrePassword"
                :error-messages="errors.collect('PrePassword')"
                label="Password"
                type="password"
                required/>
            
            <v-text-field
                prepend-icon="lock"
                v-model="password"
                v-validate="'required'"
                data-vv-name="Password"
                :error-messages="errors.collect('Password')"
                label="Repeat password"
                type="password"
                required/>
            
            <v-layout class="py-3">
                <v-spacer/>
                <v-btn dark color="blue-grey"
                    :loading="loading" depressed
                    type="submit">
                    Register
                    <v-icon small class="ml-1">person_add</v-icon>
                </v-btn>
            </v-layout>
                
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import users from '@/store/modules/users'
import { User } from '../models/User'
import { bus } from '@/main'
import { api } from '@/store/api'

@Component
export default class Register extends Vue {
    firstname: string = ''
    lastname: string = ''
    email: string = ''
    password: string = ''
    prePassword: string = ''
    message: string = ''
    status: string | undefined = 'error'
    alert: boolean = false
    loading: boolean = false

    comparePassword(): boolean {
        if(this.password !== this.prePassword) {
            this.alert = true
            this.status = 'error'
            this.message = `Password doesn't same`
            setTimeout(() => {
                this.alert = false
                this.status = ''
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
                    this.signUp()
                } 
                return
            }
            this.alert = true
            this.status = 'error'
            this.message = 'Fill all required fields, please'
        })
    }

    async signUp() {
        let newUser = {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password
        }

        try {
            this.loading = true
            await api.post('api/users', newUser)
            this.alert = true
            this.status = 'success'
            this.message = 'Congratulations! You are successfully registered!'
            this.clearForm()
        }
        catch (e) {
            console.log(e)
            this.alert = true
            this.status = 'error'
            this.message = 'Error occured while registering'
        }
        finally {
            this.loading = false
        } 
    }

    clearForm() {
        this.firstname = ''
        this.lastname = ''
        this.email = ''
        this.password = ''
        this.prePassword = ''
    }
}

</script>
