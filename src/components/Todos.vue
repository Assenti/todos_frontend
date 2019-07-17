<template>
    <v-layout column class="this-todos elevation-3">
        
        <v-toolbar dense dark flat color="blue-grey">
            
            <v-select v-model="todosType"
                class="caption"
                color="teal"
                style="max-width: 150px"
                @change="downloadTodos"
                return-object
                item-text="name"
                item-value="id"
                dense :items="todosTypes">
                <template slot="prepend-inner">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">assignment</v-icon>
                        </template>
                        <span>Select which todos to download</span>
                    </v-tooltip>
                </template>
            </v-select>

            <v-spacer></v-spacer>
            
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" flat
                        class="mx-0"
                        v-if="groups.length > 0"
                        @click="openGroups">
                    <v-icon small>group</v-icon>
                    </v-btn>
                </template>
                <span>Your groups/projects or where you are participate</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" 
                    flat class="mx-0"
                    @click="searchMenu = !searchMenu">
                    <v-icon small>search</v-icon>
                    </v-btn>
                </template>
                <span>Search todo</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon 
                    v-on="on" class="mx-0"
                    @click="refresh">
                    <v-icon small>refresh</v-icon>
                    </v-btn>
                </template>
                <span>Reload data</span>
            </v-tooltip>

            <v-menu bottom left open-on-hover offset-y max-width="220"> 
                <template v-slot:activator="{ on }">
                <v-btn icon flat
                    class="mx-0"
                    v-on="on">
                    <v-icon small>share</v-icon>
                </v-btn>
                </template>

                <v-list avatar dense>
                <v-list-tile
                    v-for="(item, i) in actions"
                    :key="i"
                    @click="item.action">
                    <v-icon small class="mr-2">{{ item.icon }}</v-icon>
                    <v-list-tile-title>
                        {{ item.title }}
                    </v-list-tile-title>
                </v-list-tile>
                </v-list>
            </v-menu>

            <v-menu bottom left open-on-hover offset-y max-width="220"> 
                <template v-slot:activator="{ on }">
                <v-btn icon flat
                    class="mx-0"
                    title="Filters"
                    v-on="on">
                    <v-icon small>filter_list</v-icon>
                </v-btn>
                </template>

                <v-list avatar dense class="py-0">
                    <div class="px-3 py-2 blue-grey--text">Sort by:</div>
                    <v-divider/>
                    <v-list-tile
                        v-for="(f, i) in filters"
                        :key="i"
                        @click="f.action">
                        <v-icon class="mr-2" :color="f.color">{{ f.icon }}</v-icon>
                        <v-list-tile-title>
                            {{ f.title }}
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>

        
        <div class="this-todos-list">
            <v-text-field
                v-if="searchMenu"
                v-model="search"
                prepend-inner-icon="search"
                class="px-3 animated slideInLeft faster"
                clearable color="teal"
                @keyup.escape="searchMenu = false, search = ''"
                label="Search todo"
                hint="Start type..."
                persistent-hint/>

            <v-layout v-if="!searchMenu" 
                align-center class="px-3 animated slideInLeft faster">
                <v-text-field
                    v-model="todo"
                    prepend-inner-icon="assignment"
                    clearable
                    append-icon="add_box"
                    @click:append="addTodo"
                    @keyup.enter="addTodo"
                    required color="teal"
                    :loading="loader"
                    label="Todo"
                    hint="Type your todo and press 'Enter' or click '+' button"
                    persistent-hint
                    :rules="[v => !!v || 'You should input todo item']"/>
                <v-progress-circular
                        :rotate="-90"
                        :size="50"
                        :width="7"
                        class="ml-2"
                        :value="todosCompletionPercentage"
                        color="teal">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                        <span v-on="on">
                            {{ todosCompletionScore }}
                        </span>
                        </template>
                        <span>Completed todos</span>
                    </v-tooltip>
                </v-progress-circular>
            </v-layout>

            <v-list three-line>
                <template v-for="(todo, index) in filteredTodos">
                    <v-list-tile
                    :key="`todo-${index}`"
                    class="this-list-item animated bounceInUp fast">

                    <div class="this-status-controls">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn flat
                                icon v-on="on"
                                class="ma-0 px-0"
                                :loading="completionLoader"
                                :color="todo.completed == 1 ? 'teal' : ''"
                                @click="toggleCompletion(todo, index)">
                                    <v-icon small>check_circle</v-icon>
                                </v-btn>
                            </template>
                            <span>Completion Indicator</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn flat
                                class="ma-0 px-0"
                                icon v-on="on"
                                :disabled="castToBool(todo.completed)"
                                :loading="importanceLoader"
                                :color="todo.important == 1 ? 'red' : ''"
                                @click="toggleImportance(todo, index)">
                                <v-icon small>{{ todo.important == 1 ? 'flag' : 'outlined_flag' }}</v-icon>
                                </v-btn>
                            </template>
                            <span>Importance Indicator</span>
                        </v-tooltip>
                    </div>

                    <v-list-tile-content>
                        <v-list-tile-title>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-icon small
                                        v-on="on" class="mr-1"
                                        @click="openTodoDetails(todo, index)">
                                        open_in_new
                                    </v-icon>
                                </template>
                                <span>Open Details</span>
                            </v-tooltip>
                            <span class="black--text no-select"
                                style="font-size: 14px; cursor: pointer"
                                :class="{'completed': todo.completed}"
                                @dblclick="editTodo(todo)">
                                {{ todo.value }}</span>
                        </v-list-tile-title>

                        <v-list-tile-sub-title class="ml-4 pl-2 grey--text this-hint no-select"
                            :class="{'completed': todo.completed}">
                            Double click on todo title to edit it
                        </v-list-tile-sub-title>

                        <v-list-tile-sub-title class="caption">
                            <v-layout align-center>
                            
                                <v-chip color="info" outline small>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-icon small class="mr-1"
                                                v-on="on" :disabled="castToBool(todo.completed)"
                                                @click="setPerformer(todo)">create</v-icon>
                                        </template>
                                        <span>Edit a todo Performer</span>
                                    </v-tooltip>
                                    
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <span :class="{'completed': todo.completed}" v-on="on">{{ todoPerformer(todo) }}</span>
                                        </template>
                                        <span>Performer of a todo</span>
                                    </v-tooltip>
                                </v-chip>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-chip v-if="!todo.completeDate" v-on="on" small color="teal" outline>
                                            <span :class="{'completed': todo.completed}" class="this-hint">{{ new Date(todo.createdAt).toISOString().substr(0, 10) }}</span>
                                        </v-chip>
                                    </template>
                                    <span>Todo start date</span>
                                </v-tooltip>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-chip v-if="todo.completeDate" v-on="on" small color="teal" text-color="white">
                                            <span class="this-hint">{{ new Date(todo.completeDate).toISOString().substr(0, 10) }}</span>
                                        </v-chip>
                                    </template>
                                    <span>Date of completion</span>
                                </v-tooltip>

                            </v-layout>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>

                        <v-list-tile-action>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                <v-btn icon class="ml-1"
                                    flat v-on="on"
                                    @click="deleteTodo(todo, index)">
                                    <v-icon small>delete_outline</v-icon>
                                </v-btn>
                                </template>
                                <span>Delete todo</span>
                            </v-tooltip>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-divider :key="index" v-if="index < todos.length - 1"/>
                </template>
            </v-list>

            <div v-if="filteredTodos.length == 0" class="this-no-todos">
                <v-layout column align-center justify-center>
                    <v-icon size="50" color="grey lighten-2">mood</v-icon>
                    <div class="caption grey--text">No todos yet</div>
                </v-layout>
            </div>

        </div>
        <v-footer height="auto"
            class="px-2" dark
            color="blue-grey">
            <v-layout justify-space-between align-center>
                <v-toolbar-title>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" flat
                            @click="openCalendar">
                            <v-icon small>date_range</v-icon>
                        </v-btn>
                        </template>
                        <span>Open a todo calendar</span>
                    </v-tooltip>
                </v-toolbar-title>
                <div class="px-2">
                    <span class="body-1 white--text">All Todos: {{ todos.length }}</span>
                    <span class="body-1 white--text mx-2">|</span>
                    <span class="body-1 white--text">Remaining: {{ todos.length - todosCompletionScore }}</span>
                </div>
            </v-layout>
        </v-footer>

        <v-dialog v-model="editTodoModal"
            max-width="400px" width="100%">
            <edit-todo v-if="editTodoModal" :todo="chosenTodo"/>
        </v-dialog>

        <v-dialog v-model="sendEmailModal"
            max-width="400px" width="100%">
            <send-email v-if="sendEmailModal" :todos="todos"/>
        </v-dialog>

        <v-dialog v-model="performerModal"
            max-width="400px" width="100%">
            <todo-performer v-if="performerModal" :todo="chosenTodo"/>
        </v-dialog>

        <v-dialog v-model="groupsModal"
            max-width="450px" width="100%">
            <groups-participants v-if="groupsModal"/>
        </v-dialog>

    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo, TodoType } from '@/models/Todo'
import EditTodo from '@/components/EditTodo.vue'
import TodoPerformer from '@/components/TodoPerformer.vue'
import GroupsParticipants from '@/components/GroupsParticipants.vue'
import SendEmail from '@/components/SendEmail.vue'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { api } from '@/store/api'
import { bus } from '@/main'
import { Group, GroupParticipant } from '../models/Group'
const backendService = new BackendService()

@Component({
    components: {
        EditTodo, 
        SendEmail, 
        TodoPerformer, 
        GroupsParticipants
    }
})
export default class Todos extends Vue {
    todos: Todo[] = todos.getTodos
    groups: Group[] = []
    groupsIn: Group[] = []
    participants: GroupParticipant[] = []
    chosenTodo?: Todo
    todo: string = ''
    loader: boolean = false
    completionLoader: boolean = false
    importanceLoader: boolean = false
    performerModal: boolean = false
    groupsModal: boolean = false
    searchMenu: boolean = false
    search: string = ''
    completedOnly: boolean = false
    importantOnly: boolean = false
    sendingLoader: boolean = false
    calendarView: boolean = false
    editTodoModal: boolean = false
    sendEmailModal: boolean = false
    datesDesc: boolean = true
    todosType: TodoType = { name: 'Personal' }
    todosTypes: TodoType[] = [
        { name: 'Personal' }
    ]
    actions: object[] = [
        {
            title: 'Send todos via Email',
            icon: 'email',
            action: this.sendViaEmail
        }
    ]
    filters: object[] = [
        {
            title: 'Date',
            icon: 'date_range',
            color: '',
            action: this.filterDates
        },
        {
            title: 'Completed',
            icon: 'check_circle',
            color: 'teal',
            action: this.filterCompleted
        },
        {
            title: 'Important',
            icon: 'flag',
            color: 'red',
            action: this.filterImportant
        },
        {
            title: 'Reset',
            icon: 'format_align_justify',
            color: '',
            action: this.resetFilter
        }
    ]
    options: object[] = [
        {
            title: 'Set performer of todo',
            icon: 'person',
            action: this.setPerformer
        },
        {
            title: 'Edit todo',
            icon: 'create',
            action: this.editTodo
        },
        {
            title: 'Delete todo',
            icon: 'delete',
            action: this.deleteTodo
        }
    ]

    created() {
        bus.$on('finishEdit', () => {
            this.editTodoModal = false
        })
        bus.$on('refreshTodos', (todos: Todo[]) => {
            this.todos = todos
        })
    }
    
    mounted() {
        setTimeout(() => {
            if(todos.getTodos.length == 0 && users.isLoggedIn) this.getTodos() 
        }, 700)
        this.getGroups()
    }

    get todosCompletionScore(): number {
        let sum: number = 0
        for(const todo of this.todos) {
            if(todo.completed == 1) sum++
        }
        return sum
    }

    get todosCompletionPercentage(): number {
        return (this.todosCompletionScore * 100) / this.todos.length
    }

    get filteredTodos(): Todo[] {
        if(this.search) {
            return this.todos.filter(todo => {
                return todo.value.toLowerCase().includes(this.search.toLowerCase())
            })
        }
        else if(this.completedOnly) {
            return this.todos.filter(todo => {
                return todo.completed
            })
        }
        else if(this.importantOnly) {
            return this.todos.filter(todo => {
                return todo.important
            })
        }
        else if(this.datesDesc) {
            return this.todos.sort((a: Todo, b: Todo) => {
                return this.getTime(b.createdAt) - this.getTime(a.createdAt)
            })
        }
        else if(!this.datesDesc) {
            return this.todos.sort((a: Todo, b: Todo) => {
                return this.getTime(a.createdAt) - this.getTime(b.createdAt)
            })
        }
        else {
            return this.todos
        } 
    }

    private getTime(date_: string) {
        let date = new Date(date_)
        return date != null ? date.getTime() : 0
    }

    refresh() {
        this.getTodos()
        this.getGroups()
    }

    downloadTodos() {
        if(this.todosType.name === 'Personal') {
            this.getTodos()
        }
        else {
            if(this.todosType.id) {
                this.getGroupTodos(this.todosType.id)
            }
        }
    }

    async getTodos() {
        this.loader = true
        try {
            const todos = await backendService.fetchTodosList()
            this.todos = todos
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.loader = false
        }
    }

    async getGroupTodos(groupId: number) {
        this.loader = true
        try {
            const todos = await backendService.fetchGroupsTodosList(groupId)
            this.todos = todos
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.loader = false
        }
    }

    async addTodo() {
        if(this.todo) {
            try {
                this.loader = true
                let todo 
                if(this.todosType.id) {
                    todo = await backendService.addTodo(this.todo, this.todosType.id)
                }
                else {
                    todo = await backendService.addTodo(this.todo)
                }
                this.todo = ''
                this.todos.push(todo)
                todos.setTodos(this.todos as Todo[])
            }
            catch (e) {
                console.log(e)
            }
            finally {
                this.loader = false
            }
        }
        else {
            bus.$emit('toast', 'Please input a todo')
        }
    }

    async getGroups() {
        try {
            const result = await backendService.getAllGroups()
            let allGroups: Group[]

            if(result.groups.length > 0 || result.groupsIn.length > 0) {
                allGroups = result.groups.length > 0 ?
                result.groups.concat(result.groupsIn) :
                result.groupsIn.concat(result.groups)
                this.groups = allGroups
                for(const g of allGroups) {
                    let group: TodoType = g as unknown as TodoType
                    this.todosTypes.push(group)
                }
            }
            else {
                bus.$emit('toast', 'You have no groups/projects')
                this.groups = []
            }
        }
        catch (e) {
            console.log(e)
            bus.$emit('toast', 'Error occurred while fetching groups')
            this.groups = []
        }
    }

    setPerformer(todo: Todo) {
        this.chosenTodo = todo
        this.performerModal = true
    }

    editTodo(todo: Todo) {
        if(todo.completed != 1) {
            this.chosenTodo = todo
            this.editTodoModal = true
        }
    }

    filterDates() {
        this.datesDesc = !this.datesDesc
    }

    filterCompleted() {
        this.completedOnly = !this.completedOnly
    }

    filterImportant() {
        this.importantOnly = !this.importantOnly
    }

    resetFilter() {
        this.importantOnly = this.completedOnly = false
    }

    openTodoDetails(todo: Todo, index: number) {
        bus.$emit('openTodoDetails', todo)
    }

    openGroups() {
        this.groupsModal = true
    }

    toggleImportance(todo: Todo, index: number) {
        this.importanceLoader = true
        backendService
        .toggleImportance(todo)
        .then(todo => {
            this.todos[index].important = todo.important
            this.importanceLoader = false
            todos.setTodos(this.todos as Todo[])
        })
    }

    toggleCompletion(todo: Todo, index: number) {
        this.completionLoader = true
        backendService
        .toggleCompletion(todo)
        .then(todo => {
            this.todos[index].completed = todo.completed
            this.todos[index].completeDate = todo.completeDate
            this.completionLoader = false
            todos.setTodos(this.todos as Todo[])
        })
    }

    async deleteTodo(todo: Todo, index: number) {
        try {
            this.loader = true
            await backendService.deleteTodo(todo)
            let id = this.todos[index].id
            this.todos = this.todos.filter(todo => {
                return todo.id != id
            })
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.loader = false
        }
    }

    openCalendar() {
        bus.$emit('openCalendar')
    }

    castToBool(value: number): boolean {
        return value == 0 ? false : true
    }

    sendViaEmail() {
        this.sendEmailModal = true
    }

    todoPerformer(todo: Todo) {
        if(todo.performer) {
            return `${todo.firstname!.substr(0, 1)}.${todo.lastname}`
        }
        else {
            return `${users.userFirstname!.substr(0, 1)}.${users.userLastname}`
        }
    }

}
</script>

<style lang="scss">
.this-todos {
    max-height: calc(100vh - 64px);
    background-color: white;
    overflow-y: none;
}

.this-todos-list {
    max-height: calc(100% - 64px);
    min-height: 440px;
    height: calc(100% - 64px);
    overflow-y: auto;
    position: relative;

    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #fff;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf; 
    }
}

.this-no-todos {
    position: absolute;
    height: calc(100% - 71px);
    width: 100%;
    top: 71px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.completed {
    text-decoration: line-through;
}

.this-list-item {
    outline-offset: -1px;
    outline: 1px solid transparent !important;

    &:hover {
        outline: 1px solid #607D8B !important;
        box-shadow: 1px 2px 8px rgba(0, 0, 0, .3);
    }
}

.this-hint {
    font-size: 11px;
}

.this-status-controls {
    display: flex;
    flex-direction: column;
    width: 40px;
}
</style>
