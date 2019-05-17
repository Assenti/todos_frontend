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

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato&display=swap');

* {
  font-family: 'Lato', sans-serif;
}

.display-2,
.display-3,
.display-4,
.title,
.headline,
.subheading {
  font-family: 'Lato', sans-serif !important;
}

#app {
  background-color: white;
}

</style>
