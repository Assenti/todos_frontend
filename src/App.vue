<template>
  <v-app>
    <div class="backdrop"></div>
    <navbar/>
    <drawer/>
    <v-content>
      <component :is="current"/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { bus } from '@/main'
import Navbar from '@/components/Navbar.vue'
import Home from '@/views/Home.vue'
import Drawer from '@/components/Drawer.vue'

@Component({
  components: {
    Navbar, Home, Drawer
  }
})
export default class App extends Vue {
  current: string = 'Home'

  created() {
    bus.$on('switchView', (view: string) => this.current = view)
  }
}
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
  background-image: url('./assets/austin-distel-rxpThOwuVgE-unsplash.jpg');
  background-size: cover;
  background-attachment: fixed;
  position: relative;
}

.backdrop {
  background-color: rgba(255, 255, 255, .6);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
}

.no-select {
  user-select: none;
}
</style>
