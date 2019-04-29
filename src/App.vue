<template>
  <v-app>
    <navbar/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/Navbar';

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {}

</script>
