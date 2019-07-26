<template>
    <v-card>
        <v-card-title class="blue-grey white--text subheading">
            <v-icon left color="white">email</v-icon>
            Send todos via email
        </v-card-title>

        <v-card-text class="pt-2">
            <v-layout>
                <span class="caption mr-4">Send to: </span>
                <v-radio-group v-model="receiverType" row>
                    <v-radio label="Me" value="Me"/>
                    <v-radio label="Other" value="Other" color="primary"/>
                </v-radio-group>
            </v-layout>

            <v-text-field v-model="receiver"
                required
                persistent-hint
                hint="Can be inputted only one email at once"
                :rules="[v => !!v || 'E-mail address is required',
                        v => /.+@.+/.test(v) || 'E-mail must be valid']"
                label="To">
                <template slot="prepend">
                    <v-icon>email</v-icon>
                </template>
            </v-text-field>

            <div class="caption grey--text pt-1 pl-4 ml-4">{{ sendingHint }}</div>

            <v-alert v-model="alert"
                border="left" text
                :type="status" 
                dismissible>
                {{ message }}
            </v-alert>

            <v-layout>
                <v-spacer/>
                <v-btn color="blue-grey" 
                    :loading="loading"
                    :disabled="!todos || todos.length == 0"
                    dark depressed @click="send">
                    Send
                    <v-icon class="ml-1" small>send</v-icon>
                </v-btn>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import { api } from '@/store/api'
import { bus } from '@/main'
import users from '@/store/modules/users'

@Component({})
export default class SendEmail extends Vue {
    receiver: string | null = ''
    loading: boolean = false
    receiverType: string = ''
    alert: boolean = false
    message: string = ''
    status: string | undefined = 'error'

    @Prop({type: Array as () => Todo[]})
    public todos!: Todo[]

    @Watch('receiverType')
    onReceiverTypeChanged(v: string) {
        if(v === 'Me') this.receiver = users.userEmail
        else {
            this.receiver = ''
        } 
    }

    get sendingHint() {
        if(this.todos.length > 0) {
            return `There are ${this.todos.length} todos to send`
        }
        else {
            return 'There is no todos to send'
        }
    }

    async send() {
        try {
            if(this.receiver) {
                this.loading = true
                await api.post(`api/sendViaEmail?email=${this.receiver}`, this.todos)
                this.alert = true
                this.message = 'Todos successfully sent'
                this.status = 'success'
            }
            else {
                this.alert = true
                this.message = 'Input a list receiver'
                this.status = 'error'
            }
        }
        catch (e) {
            this.alert = true
            this.status = 'error'
            this.message = 'Error ocurred while sending todos list'
        }
        finally {
            this.loading = false
        }
    }
}
</script>
