<template>
  <div class="home">
    <v-layout class="home-layout" align-center justify-center>
      <v-card width="400">
        <v-card-title>
          <v-layout align-center justify-space-around>
            <v-btn small flat color="primary"
              @click="current = 'Login'">
              <v-icon small class="mr-1">exit_to_app</v-icon>
              Sign in
            </v-btn>
            <v-btn small flat color="success darken-1"
              @click="current = 'Register'">
              <v-icon small class="mr-1">person_add</v-icon>
              Sign up
            </v-btn>
          </v-layout>
        </v-card-title>
        <component :is="current"></component>
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
  current: string = 'Login'
}
</script>

<style lang="scss">
.home-layout {
  min-height: calc(100vh - 48px);
}
</style>
