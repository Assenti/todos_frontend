<template>
    <v-layout column>
      <div class="title text-xs-center py-2">Your todos...</div>
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

      <v-list two-line dense>
        <template v-for="(todo, index) in todos">
          <v-list-tile
            :key="todo.ID"
            avatar
            @click="voidFunc">
            <v-list-tile-avatar>
              <v-icon>flag</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ todo.Value }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ todo.CreatedAt }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon small color="grey lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider :key="index" v-if="index < todo.length - 1" inset/>
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
import { api, setJWT } from '@/store/api'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'

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

  mounted() {
    if(todos.getTodos.length == 0) this.getTodos() 
  }

  getTodos() {
    this.loader = true
    api.get(`/usertodos?userid=${users.userId}`)
    .then(response => {
      this.todos = response.data.todos
      todos.setTodos(response.data.todos as Todo[])
    })
    .catch(err => {
      this.snackbar = true
      this.notify = 'Error ocurred while downloading todos list'
    })
    .then(() => this.loader = false)
  }

  addTodo() {
    this.loader = true

    let data = {
      Value: this.todo,
      UserID: users.userId
    }
  
    api.post('/todos', data)
    .then(response => {
      this.todos.push(response.data.todo)
      todos.setTodos(this.todos as Todo[])
    })
    .catch(err => {
      console.log(err)
      this.snackbar = true
      this.notify = 'Error ocurred while sending new todo'
    })
    .finally(() => {
      this.loader = false
      this.todo = ''
    })
  }

  voidFunc() {}

}
</script>
