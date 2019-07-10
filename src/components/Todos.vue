<template>
    <v-layout column class="this-todos">
        
        <v-toolbar dense dark flat color="blue-grey">
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

            <v-spacer/>

            <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" flat
                @click="searchMenu = !searchMenu">
                <v-icon small>search</v-icon>
                </v-btn>
            </template>
            <span>Search todo</span>
            </v-tooltip>

            <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn flat icon v-on="on"
                @click="getTodos">
                <v-icon small>refresh</v-icon>
                </v-btn>
            </template>
            <span>Refresh todos</span>
            </v-tooltip>

            <v-menu bottom left open-on-hover offset-y max-width="220"> 
                <template v-slot:activator="{ on }">
                <v-btn icon flat
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

        <v-expand-transition>
            <v-text-field
            v-if="searchMenu"
            v-model="search"
            prepend-inner-icon="search"
            class="px-3"
            clearable color="teal"
            @keyup.escape="searchMenu = false, search = ''"
            label="Search todo"
            hint="Start type..."
            persistent-hint/>
        </v-expand-transition>
        
        <div class="this-todos-list">
            <v-layout align-center class="px-3">
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
                :rules="[v => !!v || 'Todo must be provided']"
                />
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

            <v-list two-line>
            <template v-for="(todo, index) in filteredTodos">
                <v-list-tile
                :key="`todo-${index}`"
                class="this-list-item animated bounceInUp fast">

                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn flat
                            icon v-on="on"
                            class="mx-0 px-0"
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
                            class="ml-0 px-0"
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

                <v-list-tile-content>
                    <v-list-tile-sub-title>
                        <v-layout align-center>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn flat small
                                    icon v-on="on"
                                    class="mx-0 px-0"
                                    @click="openTodoDetails(todo, index)">
                                    <v-icon small>info_outline</v-icon>
                                    </v-btn>
                                </template>
                                <span>Open Details</span>
                            </v-tooltip>
                            <span class="black--text text-truncate"
                                :class="{'completed': todo.completed}">{{ todo.value }}</span>
                        </v-layout>
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
                                    <v-chip v-on="on" small color="teal" outline>
                                        <span :class="{'completed': todo.completed}" class="this-hint">{{ new Date(todo.createdAt).toISOString().substr(0, 10) }}</span>
                                    </v-chip>
                                </template>
                                <span>Start Date</span>
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
                    <v-layout>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                            <v-btn icon
                                flat v-on="on"
                                :disabled="todo.completed == 1 ? true : false "
                                @click="editTodo(todo)">
                                <v-icon small>edit</v-icon>
                            </v-btn>
                            </template>
                            <span>Edit todo</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                            <v-btn icon class="ml-1"
                                flat v-on="on"
                                @click="deleteTodo(todo, index)">
                                <v-icon small>delete</v-icon>
                            </v-btn>
                            </template>
                            <span>Delete todo</span>
                        </v-tooltip>

                    </v-layout>
                </v-list-tile-action>
                </v-list-tile>
                <v-divider :key="index" v-if="index < todos.length - 1"/>
            </template>
            </v-list>
        </div>
        <v-footer height="auto"
            class="px-2" dark
            color="blue-grey">
            <v-layout justify-center>
            <div class="px-2">
                <span class="body-1 white--text">All Todos: {{ todos.length }}</span>
                <span class="body-1 white--text mx-2">|</span>
                <span class="body-1 white--text">Remaining: {{ todos.length - todosCompletionScore }}</span>
            </div>
            </v-layout>
        </v-footer>

        <v-dialog v-model="editTodoModal"
            min-width="400px" width="50%">
            <edit-todo v-if="editTodoModal" :todo="chosenTodo"/>
        </v-dialog>

        <v-dialog v-model="sendEmailModal"
            min-width="400px" width="50%">
            <send-email v-if="sendEmailModal" :todos="todos"/>
        </v-dialog>

        <v-dialog v-model="performerModal"
            min-width="400px" width="50%">
            <todo-performer v-if="performerModal" :todo="chosenTodo"/>
        </v-dialog>

    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import EditTodo from '@/components/EditTodo.vue'
import TodoPerformer from '@/components/TodoPerformer.vue'
import SendEmail from '@/components/SendEmail.vue'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { bus } from '@/main'
const backendService = new BackendService()

@Component({
    components: {
        EditTodo, SendEmail, TodoPerformer
    }
})
export default class Todos extends Vue {
    todos: Todo[] = todos.getTodos
    chosenTodo?: Todo
    todo: string = ''
    loader: boolean = false
    completionLoader: boolean = false
    importanceLoader: boolean = false
    performerModal: boolean = false
    searchMenu: boolean = false
    search: string = ''
    completedOnly: boolean = false
    importantOnly: boolean = false
    sendingLoader: boolean = false
    calendarView: boolean = false
    editTodoModal: boolean = false
    sendEmailModal: boolean = false
    datesDesc: boolean = true
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
    }

    get todosCompletionScore(): number {
        let sum: number = 0
        for(const todo of this.todos) {
            if(todo.completed) sum++
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

    async addTodo() {
        if(this.todo) {
        try {
            this.loader = true
            const todo = await backendService.addTodo(this.todo)
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

    setPerformer(todo: Todo) {
        this.chosenTodo = todo
        this.performerModal = true
    }

    editTodo(todo: Todo) {
        this.chosenTodo = todo
        this.editTodoModal = true
    }

    deleteCompleted() {
        
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
    height: calc(100% - 64px);
    background-color: white;
    overflow-y: none;
}

.this-todos-list {
    max-height: calc(100% - 64px);
    height: calc(100% - 64px);
    overflow-y: auto;
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
</style>
