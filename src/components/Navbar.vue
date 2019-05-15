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
                <!-- <v-btn flat small router to="/">
                    <v-icon small class="mr-1">home</v-icon>Home
                </v-btn> -->
                <v-btn v-if="$store.getters.isLoggedIn"
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

@Component
export default class Navbar extends Vue {
    get username() {
        return users.username
    }

    logout() {

    }
}
</script>
