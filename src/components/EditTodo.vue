<template>
    <v-card>
        <v-card-title>
            <v-icon color="teal" left>edit</v-icon>
            <div class="title teal--text">Edit todo</div>
        </v-card-title>
        <v-card-text>
            <v-textarea
                v-model="value"
                rows="2" color="teal"
                prepend-inner-icon="assignment"
                clerable auto-grow
                required label="Todo"
                :rules="[v => !!v || 'This field is required']"
                @keyup.enter="updateTodo"/>
        </v-card-text>

        <v-card-actions class="py-4">
            <v-spacer/>
            <v-btn flat
                color="primary"
                :autofocus="true"
                :loading="loader"
                :disabled="!value" 
                @click="updateTodo">
                <v-icon small class="mr-1">save</v-icon>
                Save Changes</v-btn>
        </v-card-actions>
    </v-card>   
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backendService'
import { bus } from '@/main'
const backendService = new BackendService()

@Component
export default class EditTodo extends Vue {
  value: string = ''
  todo: undefined | Todo
  loader: boolean = false
  todos: Todo[] = todos.getTodos

  created() {
    bus.$on('editTodo', (todo: Todo) => {
      this.todo = todo
      this.value = todo.Value
    })
  }

  updateTodo() {
    this.loader = true
    let id = this.todo ? this.todo.ID : undefined
    backendService
    .updateTodo(this.value, id)
    .then(todo => {
      this.loader = false
      this.todo = todo
      
      for(let todo of this.todos) {
        if(todo.ID == this.todo.ID) {
            todo = this.todo
        }
      }
      todos.setTodos(this.todos as Todo[])
      bus.$emit('refreshTodo', this.todos)
      bus.$emit('finishEdit')
    })
  }
}
</script>

<style lang="scss">

</style>