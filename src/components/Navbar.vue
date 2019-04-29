<template>
    <div>
        <v-toolbar app dense dark>
            <v-toolbar-title class="headline text-uppercase">
                <span>Vue</span>
                <span class="font-weight-light">WITH TS</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat small router to="/">
                    <v-icon small class="mr-1">home</v-icon>Home
                </v-btn>
                <v-btn flat small router to="/about">
                    <v-icon small class="mr-1">info</v-icon>About
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script lang="ts">

</script>
