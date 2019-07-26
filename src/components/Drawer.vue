<template>
    <div>
        <slot name="content"></slot>
        <v-navigation-drawer
            v-model="drawer"
            app
            temporary>
            <v-layout style="height: 100%" column justify-space-between>
                <div>
                    <v-app-bar flat color="blue-grey" dark>
                        <v-layout align-center
                            justify-space-between>
                            <div class="title">Personal Planner</div>
                            <v-btn title="Close"
                                @click="drawer = false" icon text>
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-app-bar>

                    <v-divider/>

                    <v-list shaped dense>
                        <template v-for="(item, index) in items">
                            <v-list-item
                                :key="`item-${index}`"
                                @click="item.function">
                                <v-list-item-icon>
                                    <v-icon v-text="item.icon"/>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider :key="index" v-if="index < item.length - 1"/>
                        </template>
                    </v-list>
                </div>
                <div>
                    <v-layout column align-center justify-center>
                        <div class="headline blue-grey--text no-select">
                            Personal Planner
                            <small class="caption">ver. 2.0</small>
                        </div>
                    </v-layout>
                    <v-layout align-center justify-center class="pb-4 pt-2">
                        <div class="caption blue-grey--text text-xs-center">
                        Web application by Asset Sultanov</div>
                    </v-layout>
                    <v-layout align-center justify-center class="pb-4">
                        <a href="https://github.com/Assenti">
                            <img src="../assets/github-logo.svg"
                                title="I'm in Github" 
                                alt="Github" class="this-social-logo">
                        </a>
                        <a href="https://www.linkedin.com/in/asset-sultanov-developer/">
                            <img src="../assets/linkedin.svg" 
                                title="I'm in LinkedIn"
                                alt="LinkedIn" class="this-social-logo">
                        </a>
                    </v-layout>
                </div>
            </v-layout>
        </v-navigation-drawer>
    </div>
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

<style lang="scss">
.this-social-logo {
    width: 22px;
    margin: 0 10px;
}
</style>