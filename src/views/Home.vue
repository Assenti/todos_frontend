<template>
    <div class="home">
        <v-layout class="home-layout" align-center justify-space-around>
            <v-flex xs12 sm5>
                <v-layout column align-center>
                    <img src="../assets/logo.png" alt="Logo" class="this-logo">
                    <h1 class="display-2 text-xs-center">My Awesome <br/> Pet Project</h1>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm5>
                <v-layout column align-center>
                    <v-card width="400" v-if="!$store.getters.isLoggedIn">
                        <v-tabs centered color="indigo lighten-2" dark icons-and-text>
                            <v-tabs-slider color="deep-purple"></v-tabs-slider>
                            <v-tab href="#signin">
                                Sign in
                                <v-icon>exit_to_app</v-icon>
                            </v-tab>
                            <v-tab href="#signup">
                                Sign up
                                <v-icon>person_add</v-icon>
                            </v-tab>
                            <v-tab-item value="signin">
                            <login/>
                            </v-tab-item>
                            <v-tab-item value="signup">
                            <register/>
                            </v-tab-item>
                        </v-tabs>
                    </v-card>
                    <v-card width="400" v-else-if="$store.getters.isLoggedIn">
                        <todos/>
                    </v-card>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Todos from '@/components/Todos.vue'


@Component({
  components: {
    Login, Register, Todos
  },
})
export default class Home extends Vue {
  
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
