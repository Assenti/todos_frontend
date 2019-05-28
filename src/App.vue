<template>
  <v-app>
    <navbar/>
    <v-content>
      <component :is="current"/>
    </v-content>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { bus } from '@/main'
import Navbar from '@/components/Navbar.vue'
import Home from '@/views/Home.vue'
import Account from '@/components/Account.vue'

@Component({
  components: {
    Navbar, Home, Account
  }
})
export default class App extends Vue {
  current = 'Home'

  created() {
    bus.$on('switchView', (view) => this.current = view)
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
  background-color: white;
}

</style>
