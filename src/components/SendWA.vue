<template>
    <v-card>
        <v-card-title class="blue-grey white--text subheading">
            <v-icon left color="white">chat</v-icon>
            Send todos via WhatsApp
        </v-card-title>

        <v-card-text class="pt-2">

            <v-text-field v-model="phone"
                required
                placeholder="(___) ___ __ __"
                prefix="+7" counter="10"
                persistent-hint
                hint="Input phone number that binded to WhatsApp"
                :rules="[v => !!v || 'Number is required',
                    v => v.length <= 10 || 'Max 10 digits']"
                label="To">
                <template slot="prepend">
                    <v-icon>smartphone</v-icon>
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
                    :disabled="!todos || todos.length == 0"
                    dark depressed>
                    <a :href="whatsAppApi"
                        :disabled="!todos || todos.length == 0"
                        class="this-link">Send</a>
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
export default class SendWa extends Vue {
    receiver: string | null = ''
    loading: boolean = false
    receiverType: string = ''
    alert: boolean = false
    phone: string = ''
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

    get whatsAppApi() {
        return `https://api.whatsapp.com/send?phone=7${this.phone}&text=${this.todoList}`
    }

    get todoList() {
        let result: string = ''
        for(let i = 0; i < this.todos.length; i++) {
            result += `${i+1}) ${this.todos[i].value};\n`
        }
        return result
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


<style lang="scss" scoped>
.this-link {
    text-decoration: none;
    color: white;
    width: 100%;
    height: 100%;
}
</style>