<template>
    <div class="home">
        <v-layout wrap class="home-layout"
            align-center
            justify-space-around>

            <v-flex class="px-1" xs12 sm12 md6>
                <component class="animated bounceInLeft fast" 
                    :is="current" :chosenTodo="chosenTodo"/>
            </v-flex>

            <v-flex xs12 sm12 md6 class="px-1">
                <auth v-if="!loggedIn"/>
                <todos v-else/>
            </v-flex>
        </v-layout>

        <v-dialog v-model="accountModal" max-width="500px">
            <account-info/>
        </v-dialog>

        <v-dialog v-model="passwordModal" max-width="350px">
            <change-password/>
        </v-dialog>

        <v-dialog v-model="invitationModal" max-width="350px">
            <invitation/>
        </v-dialog>

        <v-dialog v-model="groupsModal" max-width="400px">
            <groups/>
        </v-dialog>

        <v-snackbar top right
            v-model="snackbar"
            :timeout="3000">
            {{ notify }}
            <v-btn color="white"
            flat @click="snackbar = false">
            Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Auth from '@/components/Auth.vue'
import AccountInfo from '@/components/AccountInfo.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import WelcomeText from '@/components/WelcomeText.vue'
import TodosCalendar from '@/components/TodosCalendar.vue'
import TodoDetails from '@/components/TodoDetails.vue'
import Invitation from '@/components/Invitation.vue'
import Groups from '@/components/Groups.vue'
import Todos from '@/components/Todos.vue'
import users from '@/store/modules/users'
import { Todo } from '@/models/Todo'
import { bus } from '@/main'

@Component({
  components: {
    Auth, 
    Todos, 
    WelcomeText, 
    TodosCalendar, 
    AccountInfo, 
    ChangePassword, 
    TodoDetails,
    Invitation,
    Groups
  },
})
export default class Home extends Vue {
    loggedIn: boolean = users.isLoggedIn
    accountModal: boolean = false
    passwordModal: boolean = false
    invitationModal: boolean = false
    groupsModal: boolean = false
    snackbar: boolean = false
    notify: string = ''
    current: string = 'WelcomeText'
    chosenTodo: Todo = {
        id: 0,
        userId: 0,
        value: '',
        important: 0,
        completed: 0,
        createdAt: '',
        updatedAt: '',
        completeDate: '',
        status: '',
        performer: 0,
        lastname: '',
        firstname: ''
    }

    created() {
        bus.$on('openCalendar', () => this.current = 'TodosCalendar')
        bus.$on('hideCalendar', () => this.current = 'WelcomeText')
        bus.$on('openAccountInfo', () => this.accountModal = true)
        bus.$on('closeAccountInfo', () => this.accountModal = false)
        bus.$on('openPasswordModal', () => this.passwordModal = true)
        bus.$on('closePasswordModal', () => this.passwordModal = false)
        bus.$on('loggedOut', () => this.loggedIn = false)
        bus.$on('loggedIn', () => this.loggedIn = true)
        bus.$on('toast', (message: string) => {
            this.snackbar = true
            this.notify = message
        })
        bus.$on('openTodoDetails', (todo: Todo) => {
            this.chosenTodo = todo
            this.current = 'TodoDetails'
        })
        bus.$on('closeTodoDetails', () => this.current = 'WelcomeText')
        bus.$on('openInvitation', () => this.invitationModal = true)
        bus.$on('openGroups', () => this.groupsModal = true)
    }
}
</script>

<style lang="scss">
.home {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
}

.home-layout {
  min-height: calc(100vh - 64px);
}
.this-logo {
    width: 100px;
}
.this-github-logo {
    width: 18px;
    margin: 0 4px;
}
</style>
