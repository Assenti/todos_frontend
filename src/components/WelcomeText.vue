<template>
    <v-layout column align-center class="this-welcome">
        <h1 class="display-1 blue-grey--text text-xs-center no-select">
            Personal Planner
            <small class="caption">ver. 2.0</small>
        </h1>
        <v-divider/>
        <v-layout align-center>
            <div class="caption blue-grey--text text-xs-center">
            Web application by</div>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <img v-on="on"
                        src="../assets/github-logo.svg" 
                        alt="Github" class="this-github-logo">
                </template>
                <span>I'm on Github</span>
            </v-tooltip>
            
            <div class="caption grey--text text-xs-center">
            <a href="https://github.com/Assenti" target="_blank">Asset Sultanov</a></div>
        </v-layout>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
})
export default class WelcomeText extends Vue {

}
</script>

<style lang="scss">
@media (max-width: 400px) {
    .this-welcome {
        display: none;
    }
}
</style>

