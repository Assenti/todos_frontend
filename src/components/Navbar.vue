<template>
    <div>
        <v-toolbar app flat
            color="transparent">
            <v-toolbar-side-icon v-if="loggedIn" @click="menu = !menu"/>

            <v-toolbar-title class="headline ml-2 no-select">
                <span class="font-weight-bold">
                    Personal Planner
                    <small class="caption">ver. 2.0</small>
                </span>
            </v-toolbar-title>

            <v-spacer/>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn v-if="loggedIn && view === 'Home'"
                    flat small @click="openAccountInfo">
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import users from '@/store/modules/users'
import { bus } from '@/main'

@Component({})
export default class Navbar extends Vue {
    loggedIn: boolean = users.isLoggedIn
    view: string = 'Home'
    menu: boolean = false

    get username(): string | null {
        return users.username
    }

    created() {
        bus.$on('loggedIn', () => this.loggedIn = true)
        bus.$on('loggedOut', () => this.loggedIn = false)
        bus.$on('drawerTrue', () => this.menu = true)
        bus.$on('drawerFalse', () => this.menu = false)
    }

    logout() {
        users.logout()
        bus.$emit('loggedOut')
        this.loggedIn = false
    }

    openAccountInfo() {
        bus.$emit('openAccountInfo')
    }

    switchView(view: string) {
        bus.$emit('switchView', view)
        this.view = view
    }

    @Watch('menu')
    onMenuChanged(v: boolean) {
        if(v == true) bus.$emit('openDrawer')
        else if(v == false) bus.$emit('closeDrawer')
    }
}
</script>
