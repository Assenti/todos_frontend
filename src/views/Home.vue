<template>
    <div class="home">
        <v-layout class="home-layout" align-center justify-center>
            <v-card width="400">
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
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'

@Component({
  components: {
    Login, Register
  },
})
export default class Home extends Vue {
  
}
</script>

<style lang="scss">
.home-layout {
  min-height: calc(100vh - 48px);
}
</style>
