<template>
    <v-navigation-drawer
      v-model="drawer"
      absolute bottom
      temporary>
        <v-layout style="height: 100%" column justify-space-between>
            <div>
                <v-toolbar flat color="blue-grey" dark>
                    <v-layout align-center
                        justify-space-between>
                        <div class="title">Personal Planner</div>
                        <v-btn title="Close"
                            @click="drawer = false" icon flat>
                            <v-icon>chevron_left</v-icon>
                        </v-btn>
                    </v-layout>
                </v-toolbar>

                <v-divider/>

                <v-list nav dense avatar>
                    <template v-for="(item, index) in items">
                        <v-list-tile
                            :key="`item-${index}`"
                            @click="item.function">
                            <v-list-tile-avatar class="mx-0 px-0">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="index" v-if="index < item.length - 1"/>
                    </template>
                </v-list>
            </div>
            <div>
                <h1 class="headline blue-grey--text text-xs-center no-select">
                    Personal Planner
                    <small class="caption">ver. 2.0</small>
                </h1>
                <v-layout align-center justify-center class="pb-4">
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
            </div>
        </v-layout>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { bus } from '@/main'
import { ListItem } from '@/models/ListItem'
import users from '@/store/modules/users'

@Component({})
export default class Drawer extends Vue {
    drawer: boolean = false
    group: undefined = undefined
    loggedIn: boolean = users.isLoggedIn
    items: Array<object> = [
        { 
            title: 'Account', 
            icon: 'account_box', 
            function: this.openAccount
        },
        { 
            title: 'Change password', 
            icon: 'lock', 
            function: this.openChangePassword
        },
        { 
            title: 'Invite friends', 
            icon: 'person_add', 
            function: this.openInvitation
        },
        { 
            title: 'Create project/group', 
            icon: 'group', 
            function: this.openGroups
        },
        { 
            title: 'Log out', 
            icon: 'exit_to_app', 
            function: this.logout
        }
    ]

    @Watch('drawer')
    onDrawerChanged(v: boolean) {
        if(v == true) bus.$emit('drawerTrue')
        else if(v == false) bus.$emit('drawerFalse')
    }

    created() {
        bus.$on('openDrawer', () => this.drawer = true)
        bus.$on('closeDrawer', () => this.drawer = false)
        bus.$on('loggedOut', () => this.loggedIn = false)
        bus.$on('loggedIn', () => this.loggedIn = true)
    }

    openAccount() {
        bus.$emit('openAccountInfo')
    }

    openChangePassword() {
        bus.$emit('openPasswordModal')      
    }

    openInvitation() {
        bus.$emit('openInvitation')      
    }

    openGroups() {
        bus.$emit('openGroups')      
    }

    logout() {
        this.drawer = false
        users.logout()
        bus.$emit('loggedOut')
    }
}
</script>