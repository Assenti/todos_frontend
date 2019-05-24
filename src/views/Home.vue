<template>
    <div class="home">
        <v-layout class="home-layout" align-center justify-space-around>
            <v-flex class="hidden-xs-only" xs12 sm5>
                <v-layout column align-center>
                    <h1 class="display-2 teal--text text-xs-center">Personal Planner</h1>
                    <h3 class="headline text-xs-center">Web application</h3>
                    <h3 class="subheading text-xs-center">by Asset Sultanov</h3>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm5>
                <auth v-if="!loggedIn"/>
                <todos v-else/>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Auth from '@/components/Auth.vue'
import Todos from '@/components/Todos.vue'
import users from '@/store/modules/users'
import { bus } from '@/main'

@Component({
  components: {
    Auth, Todos
  },
})
export default class Home extends Vue {
    loggedIn: boolean = users.isLoggedIn
    dialog: boolean = false

    created() {
        bus.$on('loggedOut', () => this.loggedIn = false)
        bus.$on('loggedIn', () => this.loggedIn = true)
    }
}
</script>

<style lang="scss">
.home-layout {
  min-height: calc(100vh - 48px);
}
.this-logo {
    width: 100px;
}
</style>
