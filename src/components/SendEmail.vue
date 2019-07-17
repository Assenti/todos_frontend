<template>
    <v-card>
        <v-card-title class="blue-grey white--text subheading">
            <v-icon small left color="white">email</v-icon>
            Send todos via email
        </v-card-title>
        <v-card-text>
            
            <v-layout>
                <span class="caption mr-4">Send to: </span>
                <v-radio-group v-model="receiverType" row>
                    <v-radio label="Me" value="Me" color="primary"/>
                    <v-radio label="Other" value="Other" color="primary"/>
                </v-radio-group>
            </v-layout>

            <v-text-field v-model="receiver"
                required browser-autocomplete="on"
                persistent-hint
                hint="Can be inputted only one email at once"
                :rules="[value => !!value || 'Required']"
                label="To">
                <template slot="prepend">
                    <v-icon>person</v-icon>
                </template>
            </v-text-field>

            <div class="caption grey--text pt-1 pl-4 ml-2">{{ sendingHint }}</div>

            <v-alert v-model="alert"
                outline
                :type="status" dense 
                dismissible>
                {{ message }}
            </v-alert>

            <v-layout>
                <v-spacer/>
                <v-btn color="primary" 
                    :loading="loading"
                    :disabled="!todos || todos.length == 0"
                    flat @click="send">
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
            this.loading = true
            await api.post(`api/sendViaEmail?email=${this.receiver}`, this.todos)
            this.alert = true
            this.message = 'Todos successfully sent'
            this.status = 'success'
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
