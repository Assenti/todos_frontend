<template>
    <v-card width="500" class="pa-4">
        <v-layout class="mb-4" justify-center>
            <div class="text-xs-center headline">Sign in</div>
        </v-layout>
        <v-form>
            <v-alert v-model="alert" :type="status" outline>
                {{ message }}
            </v-alert>
            <v-text-field outline
                prepend-inner-icon="person"
                v-model="email"
                :rules="[v => !!v || 'E-mail is required',
                        v => /.+@.+/.test(v) || 'E-mail must be valid']"
                label="E-mail"
                required/>

            <v-text-field outline
                prepend-inner-icon="lock"
                v-model="password"
                :rules="[v => !!v || 'Password is required']"
                label="Password"
                required/>

            <v-layout class="py-3" justify-center>
                <v-btn color="primary" @click="login">Login</v-btn>
            </v-layout>
                
        </v-form>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import users from '@/store/modules/users';

@Component
export default class Login extends Vue {
    email: string = ''
    password: string = ''
    message: string = ''
    alert: boolean = false
    status: string | undefined 

    login() {
        users.login({
            email: this.email,
            password: this.password
        })
    }
}

</script>
