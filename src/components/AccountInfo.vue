<template>
    <v-card flat class="pa-2">
        <v-card-title>
            <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text class="px-4">
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
    userName: string | null = users.username
    userEmail: string | null = users.userEmail
    userRegisteredDate: string | null = users.registeredDate

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
            title: this.userRegisteredDate,
            desc: 'User registered date',
            icon: 'event'
        },
        // {
        //     title: `${32} years old`,
        //     desc: 'User birth date',
        //     icon: 'cake'
        // }
    ]
}
</script>

<style>
.account {
    min-height: calc(100vh - 48px);
} 
</style>
