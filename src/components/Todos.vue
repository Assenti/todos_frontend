<template>
    <v-layout column>
      <div class="title text-xs-center py-2">Your todos...</div>
      
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
        <v-btn flat
          icon 
          title="Refresh todos"
          color="primary"
          class="ml-3"
          @click="getTodos">
          <v-icon medium>refresh</v-icon>
        </v-btn>
      </v-layout>

      <v-list two-line dense>
        <template v-for="(todo, index) in todos">
          <v-list-tile
            :key="todo.ID"
            avatar
            @click="voidFunc">
            <v-list-tile-avatar>
              <v-btn flat
                icon
                :loading="loader"
                title="Importance Indicator"
                :color="todo.Important == 1 ? 'red' : ''"
                @click="toggleImportance(todo, index)">
                <v-icon>flag</v-icon>
              </v-btn>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ todo.Value }}</v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                {{ new Date(todo.CreatedAt).toLocaleDateString() }}
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

  created() {
    bus.$on('toast', (message: string) => {
      this.snackbar = true
      this.notify = message
    })
  }
  
  mounted() {
    if(todos.getTodos.length == 0 && !this.isTodosBelongToUser()) this.getTodos() 
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

  voidFunc() {}

}
</script>
