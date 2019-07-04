<template>
    <div>
        <v-toolbar app dense 
            flat dark
            color="teal">
            <v-icon medium>assignment</v-icon>
            <v-toolbar-title class="headline ml-1">
                <span class="font-weight-bold darken-1">
                    Personal Planner
                    <small class="caption">ver. 2.0</small>
                </span>
            </v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
                <v-btn v-if="loggedIn && view === 'Home'"
                    flat small @click="switchView('Account')">
                    <v-icon small class="mr-1">account_circle</v-icon>Account
                </v-btn>
                <v-btn v-if="loggedIn && view === 'Account'"
                    flat small @click="switchView('Home')">
                    <v-icon small class="mr-1">home</v-icon>Home
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
import Account from '@/components/Account.vue'
import users from '@/store/modules/users'
import { bus } from '@/main'

@Component({
    components: {
        Account
    }
})

export default class Navbar extends Vue {
    loggedIn: boolean = users.isLoggedIn
    view: string = 'Home'

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
        location.reload()
    }

    switchView(view: string) {
        bus.$emit('switchView', view)
        this.view = view
    }
}
</script>
