<template>
    <v-navigation-drawer
      v-model="drawer"
      absolute bottom
      temporary>
        <v-toolbar flat color="blue-grey" dark>
            <v-list>
                <v-list-tile>
                    <v-list-tile-title class="title">
                        <v-layout align-center
                            style="height:100%" 
                            justify-space-between>
                            Personal Planner
                            <v-btn title="Close" small
                                @click="drawer = false" icon text>
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-toolbar>

        <v-divider/>

        <v-list nav dense avatar>
            <template v-for="(item, index) in items">
                <v-list-tile v-if="item.available"
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
import { Component, Vue } from 'vue-property-decorator'
import { bus } from '@/main'
import { ListItem } from '@/models/ListItem'
import users from '@/store/modules/users'

@Component({
  components: {
  }
})
export default class Drawer extends Vue {
    drawer: boolean = false
    group: undefined = undefined
    loggedIn: boolean = users.isLoggedIn
    items: Array<object> = [
        { 
            title: 'Account', 
            icon: 'account_box', 
            function: this.openAccount,
            available: this.loggedIn
        },
        { 
            title: 'Change Password', 
            icon: 'lock', 
            function: this.openChangePassword,
            available: this.loggedIn 
        },
        { 
            title: 'Invite friends', 
            icon: 'person_add', 
            function: this.openInvitation,
            available: this.loggedIn 
        },
        { 
            title: 'Logout', 
            icon: 'exit_to_app', 
            function: this.logout,
            available: this.loggedIn 
        }
    ]

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

  logout() {
      this.drawer = false
      bus.$emit('loggedOut')
  }

}
</script>