<template>
    <div>
        <v-toolbar app dense 
            dark flat 
            color="teal">
            <v-icon medium>assignment</v-icon>
            <v-toolbar-title class="headline ml-1">
                <span class="font-weight-bold darken-1">Personal Planner</span>
            </v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
                <v-btn v-if="loggedIn"
                    flat small @click="dialog = !dialog">
                    <v-icon small class="mr-1">account_circle</v-icon>Account
                </v-btn>
                <v-btn v-if="loggedIn"
                    flat small @click="logout">
                    <v-icon small class="mr-1">exit_to_app</v-icon>Sign out
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <account/>
        </v-dialog>
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
    dialog: boolean = false

    get username(): string | null {
        return users.username
    }

    created() {
        bus.$on('loggedIn', () => this.loggedIn = true)
        bus.$on('closeAccount', () => this.dialog = false)
    }

    logout() {
        users.logout()
        bus.$emit('loggedOut')
        this.loggedIn = false
    }
}
</script>
