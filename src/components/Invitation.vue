<template>
    <v-card>
        <v-card-title class="subheading blue-grey white--text">
            <v-icon left color="white">person_add</v-icon>
            Invite your friend
        </v-card-title>

        <v-card-text class="pt-3">
            <v-text-field v-model="receiver"
                prepend-icon="email"
                required persistent-hint
                hint="Input your friend's email and click send button"
                :rules="[value => !!value || 'Required',
                        v => /.+@.+/.test(v) || 'E-mail must be valid']"
                label="To">
            </v-text-field>

            <v-alert v-model="alert"
                border="left" text
                :type="status" 
                dismissible>
                {{ message }}
            </v-alert>

            <v-layout class="mt-2">
                <v-spacer/>
                <v-btn color="primary" 
                    :loading="loading"
                    :disabled="!receiver"
                    text @click="send">
                    Send
                    <v-icon class="ml-1" small>send</v-icon>
                </v-btn>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import { api } from '@/store/api'
import { bus } from '@/main'
import users from '@/store/modules/users'

@Component({})
export default class Invitation extends Vue {
    receiver: string | null = ''
    loading: boolean = false
    alert: boolean = false
    message: string = ''
    status: string | undefined = 'error'

    async send() {
        try {
            this.loading = true
            const inviter = users.username
            await api.get(`api/sendInvitation?email=${this.receiver}&inviter=${inviter}`)
            this.alert = true
            this.message = 'Invitation successfully sent'
            this.status = 'success'
        }
        catch (e) {
            this.alert = true
            this.status = 'error'
            this.message = 'Error ocurred while sending invitation'
        }
        finally {
            this.loading = false
        }
    }
}
</script>
