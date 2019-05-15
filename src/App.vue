<template>
  <v-app>
    <navbar/>
    <v-content>
      <home/>
    </v-content>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/Navbar.vue'
import Home from '@/views/Home.vue'

@Component({
  components: {
    Navbar, Home
  }
})
export default class App extends Vue {}

</script>
