<template>
    <div class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline green--text">Sign up</div>
        </v-layout>
        <v-form>
            <v-alert v-model="alert" type="error" outline>
                {{ message }}
            </v-alert>
            <v-text-field 
                prepend-inner-icon="person"
                v-model="firstname"
                :rules="[v => !!v || 'Firstname is required']"
                label="Firstname"
                required/>
                <v-text-field
                prepend-inner-icon="person"
                v-model="lastname"
                :rules="[v => !!v || 'Lastname is required']"
                label="Lastname"
                required/>
            <v-text-field
                prepend-inner-icon="email"
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
            
            <v-layout class="py-3">
                <v-spacer></v-spacer>
                <v-btn flat color="green" @click="register">
                    <v-icon small class="mr-1">person_add</v-icon>
                    Register
                </v-btn>
            </v-layout>
                
        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import users from '@/store/modules/users';

@Component
export default class Register extends Vue {
    firstname: string = ''
    lastname: string = ''
    email: string = ''
    password: string = ''
    message: string = ''
    alert: boolean = false

    register() {
        // users.register({
        //     firstname: this.firstname,
        //     lastname: this.lastname,
        //     email: this.email,
        //     password: this.password
        // })
    }
}

</script>
