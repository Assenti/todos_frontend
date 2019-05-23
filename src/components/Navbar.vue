<template>
    <div>
        <v-toolbar app dense 
            dark flat 
            color="indigo lighten-2">
            <v-toolbar-title class="headline text-uppercase">
                <span class="font-weight-bold darken-1">Vue </span>
                <span class="font-weight-light text-none">with </span>
                <span class="font-weight-bold">TS</span>
            </v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
                <v-btn v-if="loggedIn"
                    flat small @click="openAccount">
                    <v-icon small class="mr-1">account_circle</v-icon>Account
                </v-btn>
                <v-btn v-if="loggedIn"
                    flat small @click="logout">
                    <v-icon small class="mr-1">exit_to_app</v-icon>Sign out
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import users from '@/store/modules/users'
import { bus } from '@/main'

@Component
export default class Navbar extends Vue {
    loggedIn: boolean = users.isLoggedIn
    dialog: boolean = false

    get username(): string | null {
        return users.username
    }

    created() {
        bus.$on('loggedIn', () => this.loggedIn = true)
    }

    logout() {
        users.logout()
        bus.$emit('loggedOut')
        this.loggedIn = false
    }

    openAccount() {

    }
}
</script>
