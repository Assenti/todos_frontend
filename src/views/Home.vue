<template>
  <div class="home">
    <h1 class="display-3">Home Page</h1>
    <v-layout justify-center>
      <login/>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Login.vue';

@Component({
  components: {
    Login
  },
})
export default class Home extends Vue {}
</script>
