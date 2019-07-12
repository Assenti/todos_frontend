<template>
    <v-navigation-drawer
      v-model="drawer"
      absolute bottom
      temporary>
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