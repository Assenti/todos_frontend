<template>
    <div class="account">
        <v-layout>
            <v-navigation-drawer permanent
                stateless
                height="100%">
                <v-toolbar flat height="170px">
                    <v-layout justify-center align-center>
                        <v-avatar size="150">
                            <img src="../assets/rawpixel-579231-unsplash.jpg" alt="">
                        </v-avatar>
                    </v-layout>
                </v-toolbar>
                <v-divider/>
                <v-list class="pt-0">
                    <v-list-tile v-for="(item, index) in sections" 
                        :key="index" :dark="current === item.name"
                        :class="{'teal': current === item.name}"
                        @click="switchSection(item.name)">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title :class="{'white--text': current === item.name}">
                                {{ item.title }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-layout>
                <component :is="current"/>
            </v-layout>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import ChangePassword from '@/components/ChangePassword.vue'
import AccountInfo from '@/components/AccountInfo.vue'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backendService'
import { bus } from '@/main'
import { User } from '../models/User'
const backendService = new BackendService()

@Component({
  components: {
    ChangePassword, AccountInfo
  }
})
export default class Account extends Vue {
    dialog: boolean = false
    alert: boolean = false
    message: string = ''
    loader: boolean = false
    loading: boolean = false
    password: string = ''
    newPassword: string = ''
    correctPassword: boolean = false
    current: string = 'AccountInfo'
    sections: object[] = [
        {
            title: 'Account',
            icon: 'account_circle',
            name: 'AccountInfo'
        },
        {
            title: 'Change Password',
            icon: 'lock',
            name: 'ChangePassword'
        }
    ]

    created() {
        bus.$on('notify', (message: string) => {
            this.alert = true
            this.message = message
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }
  
    mounted() {
    }

    checkPassword() {
        this.loader = true
        let data = {
            ID: users.userId,
            Email: users.userEmail,
            Password: this.password
        }
        backendService
        .passwordCheck(data as User)
        .then(() => {
            this.loader = false
            this.correctPassword = true
        })
    }

    change() {
        this.loading = true
        let data = {
            ID: users.userId,
            Email: users.userEmail,
            Password: this.newPassword
        }
        backendService
        .passwordChange(data as User)
        .then(() => {
            this.loading = false
        })
    }

    switchSection(section: string) {
        this.current = section
    }

    close() {
        bus.$emit('closeAccount')
    }
}
</script>

<style>
.account {
    min-height: calc(100vh - 48px);
} 
</style>
