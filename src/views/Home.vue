<template>
    <div class="home">
        <v-layout wrap class="home-layout"
            align-center
            justify-space-around>
            <v-flex class="hidden-sm-and-down" xs12 sm12 md4>
                <welcome-text/>
            </v-flex>
            <v-flex xs12 sm12 md6>
                <auth v-if="!loggedIn"/>
                <todos v-else/>
            </v-flex>
        </v-layout>

        <v-snackbar top right
            v-model="snackbar"
            :timeout="3000">
            {{ notify }}
            <v-btn color="pink"
            flat @click="snackbar = false">
            Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Auth from '@/components/Auth.vue'
import WelcomeText from '@/components/WelcomeText.vue'
import Todos from '@/components/Todos.vue'
import users from '@/store/modules/users'
import { bus } from '@/main'

@Component({
  components: {
    Auth, Todos, WelcomeText
  },
})
export default class Home extends Vue {
    loggedIn: boolean = users.isLoggedIn
    dialog: boolean = false
    snackbar: boolean = false
    notify: string = ''

    created() {
        bus.$on('loggedOut', () => this.loggedIn = false)
        bus.$on('loggedIn', () => this.loggedIn = true)
        bus.$on('toast', (message: string) => {
            this.snackbar = true
            this.notify = message
        })
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
.this-github-logo {
    width: 18px;
    margin: 0 4px;
}
</style>
