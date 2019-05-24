<template>
    <v-layout column>
      <v-toolbar dark dense flat color="teal">
        <v-toolbar-title class="white--text">Tasks: {{ todos.length }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon
          @click="searchMenu = !searchMenu">
          <v-icon>search</v-icon>
        </v-btn>

        <v-btn icon
          @click="getTodos">
          <v-icon>refresh</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>

      <v-expand-transition>
        <v-text-field
          v-if="searchMenu"
          v-model="search"
          prepend-inner-icon="search"
          clearable
          @keyup.escape="searchMenu = false, search = ''"
          label="Search todo"
          hint="Start type..."
          persistent-hint/>
      </v-expand-transition>
      
      <v-layout align-center>
        <v-text-field
          v-model="todo"
          prepend-inner-icon="assignment"
          clearable
          append-icon="add_box"
          @click:append="addTodo"
          @keyup.enter="addTodo"
          required
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

      <v-list two-line dense>
        <template v-for="(todo, index) in filteredTodos">
          <v-list-tile
            :key="todo.ID"
            @click="voidFunc">
            <v-list-tile-avatar class="mx-0 px-0">
              <v-btn flat
                icon
                class="mx-0 px-0"
                :loading="loader"
                title="Completion Indicator"
                :color="todo.Completed == 1 ? 'green' : ''"
                @click="toggleCompletion(todo, index)">
                <v-icon>check_circle</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-avatar class="mx-0 px-0">
              <v-btn flat
                icon
                :disabled="castToBool(todo.Completed)"
                class="mx-0 px-0"
                :loading="loader"
                title="Importance Indicator"
                :color="todo.Important == 1 ? 'red' : ''"
                @click="toggleImportance(todo, index)">
                <v-icon>flag</v-icon>
              </v-btn>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title :class="{'completed': todo.Completed}">
                {{ todo.Value }}</v-list-tile-title>
              <v-list-tile-sub-title class="caption"
                :class="{'completed': todo.Completed}">
                created at: {{ new Date(todo.CreatedAt).toLocaleDateString() }}
              </v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon
                flat
                @click="deleteTodo(todo, index)"
                ripple>
                <v-icon small>delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider :key="index" v-if="index < todos.length - 1"/>
        </template>
      </v-list>
      <v-footer height="auto"
        dark class="px-2"
        color="teal">
        <v-layout>
          <v-btn icon
            class="mr-3" 
            @click="completedOnly = !completedOnly">
            <v-icon>check_circle</v-icon>
          </v-btn>
          <v-btn icon 
            @click="importantOnly = !importantOnly">
            <v-icon>flag</v-icon>
          </v-btn>
        </v-layout>
      </v-footer>

      <v-snackbar top right
        v-model="snackbar"
        :timeout="3000">
        {{ notify }}
        <v-btn color="pink"
          flat @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>

    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backendService'
import { bus } from '@/main'
const backendService = new BackendService()

@Component({
  components: {
    
  }
})
export default class Todos extends Vue {
  todos: Todo[] = todos.getTodos
  todo: string = ''
  snackbar: boolean = false
  notify: string = ''
  loader: boolean = false
  searchMenu: boolean = false
  search: string = ''
  completedOnly: boolean = false
  importantOnly: boolean = false

  created() {
    bus.$on('toast', (message: string) => {
      this.snackbar = true
      this.notify = message
    })
  }
  
  mounted() {
    if(todos.getTodos.length == 0 && !this.isTodosBelongToUser()) this.getTodos() 
  }

  get todosCompletionScore(): number {
    let sum: number = 0
    for(const todo of this.todos) {
      if(todo.Completed) sum++
    }
    return sum
  }

  get todosCompletionPercentage(): number {
    return (this.todosCompletionScore * 100) / this.todos.length
  }

  get filteredTodos(): Todo[] {
    if(this.search) {
      return this.todos.filter(todo => {
        return todo.Value.toLowerCase().includes(this.search.toLowerCase())
      })
    }
    else {
      return this.todos
    }
    
  }

  getTodos() {
    this.loader = true
    backendService
    .fetchTodosList()
    .then((todos) => {
      this.todos = todos
      this.loader = false
    })
  }

  addTodo() {
    this.loader = true
    backendService
    .addTodo(this.todo)
    .then(todo => {
      this.loader = false
      this.todo = ''
      this.todos.push(todo)
      todos.setTodos(this.todos as Todo[])
    })
  }

  toggleImportance(todo: Todo, index: number) {
    this.loader = true
    backendService
    .toggleImportance(todo)
    .then(todo => {
      this.todos[index].Important = todo.Important
      this.loader = false
      todos.setTodos(this.todos as Todo[])
    })
  }

  toggleCompletion(todo: Todo, index: number) {
    this.loader = true
    backendService
    .toggleCompletion(todo)
    .then(todo => {
      this.todos[index].Completed = todo.Completed
      this.loader = false
      todos.setTodos(this.todos as Todo[])
    })
  }

  deleteTodo(todo: Todo, index: number) {
    this.loader = true
    backendService
    .deleteTodo(todo)
    .then(() => {
      let id = this.todos[index].ID
      this.todos = this.todos.filter(todo => {
        return todo.ID != id
      })
      this.loader = false
    })
  }

  isTodosBelongToUser(): boolean | undefined {
    if(todos.getTodos.length > 0) {
      users.userId == todos.getTodos[0].UserID
    }
    else {
      return false
    }
  }

  castToBool(value: number): boolean {
    return value == 0 ? false : true
  }

  voidFunc() {}

}
</script>

<style lang="scss">
.completed {
  text-decoration: line-through;
}
</style>