<template>
    <v-layout column align-center class="this-welcome">
        <h1 class="display-1 blue-grey--text text-xs-center no-select">
            Personal Planner
            <small class="caption">ver. 2.0</small>
        </h1>
        <v-divider/>
        <v-layout align-center>
            <div class="caption text-xs-center">
            Web application by Asset Sultanov</div>
        </v-layout>
        <v-layout align-center justify-center class="py-4">
            <a href="https://github.com/Assenti" target="_blank">
                <img src="../assets/github-logo.svg"
                    title="I'm in Github" 
                    alt="Github" class="this-social-logo">
            </a>
            <a href="https://www.linkedin.com/in/asset-sultanov-developer/"
                target="_blank">
                <img src="../assets/linkedin.svg" 
                    title="I'm in LinkedIn"
                    alt="LinkedIn" class="this-social-logo">
            </a>
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

