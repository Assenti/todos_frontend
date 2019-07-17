<template>
    <v-card flat>

        <v-card-title class="subheading blue-grey white--text">
            <v-icon small left color="white">person</v-icon>
            User Profile
        </v-card-title>

        <v-card-text class="px-3">
            <v-list avatar two-line>
                <v-list-tile v-for="(item, index) in items" :key="index">
                    <v-list-tile-avatar>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.title }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                            {{ item.desc }}
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { bus } from '@/main'
import { User } from '../models/User'
const backendService = new BackendService()

@Component
export default class AccountInfo extends Vue {
    userName: string = users.username!
    userEmail: string = users.userEmail!
    userRegisteredDate: string = users.registeredDate!
    items: object[] = [
        {
            title: users.username,
            desc: 'User name',
            icon: 'person'
        },
        {
            title: this.userEmail,
            desc: 'User Email',
            icon: 'email'
        },
        {
            title: this.userRegisteredDateHandler,
            desc: 'User registered date',
            icon: 'event'
        },
        {
            title: this.dateTimeHandler(users.getLastLoggedOn),
            desc: 'User last logged on date and time',
            icon: 'exit_to_app'
        },
        // {
        //     title: `${32} years old`,
        //     desc: 'User birth date',
        //     icon: 'cake'
        // }
    ]

    get userRegisteredDateHandler(): string | null {
        if(this.userRegisteredDate) {
            return new Date(this.userRegisteredDate).toISOString().substr(0, 10)
        }
        else return null
    }

    dateTimeHandler(date: string | undefined): string | undefined {
        if(date) {
            // 2019-07-18T00:50:14.901713+06:00 - input format
            return `${date.slice(0, 10)} ${date.slice(11, 19)}`
        }
        else return undefined
    }
}
</script>

<style>
.account {
    min-height: calc(100vh - 48px);
} 
</style>
