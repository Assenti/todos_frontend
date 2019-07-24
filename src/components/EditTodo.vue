<template>
    <v-card>
        <v-card-title class="blue-grey white--text subheading">
            <v-icon left color="white">edit</v-icon>
            Edit todo
        </v-card-title>
        
        <v-card-text>
            <v-textarea
                v-model="todo.value"
                rows="1"
                clerable auto-grow
                required label="Current todo"
                :rules="[v => !!v || 'Required']"
                @keyup.enter="updateTodo">
                <template slot="prepend-inner">
                    <v-icon small>assignment</v-icon>
                </template>
            </v-textarea>
        </v-card-text>

        <v-card-actions class="py-4">
            <v-spacer/>
            <v-btn text
                color="primary"
                :autofocus="true"
                :loading="loader"
                :disabled="!todo.value" 
                @click="updateTodo">
                <v-icon small class="mr-1">save</v-icon>
                save</v-btn>
        </v-card-actions>
    </v-card>   
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { bus } from '@/main'
const backendService = new BackendService()

@Component
export default class EditTodo extends Vue {
  loader: boolean = false
  todos: Todo[] = todos.getTodos

  @Prop({type: Object as () => Todo})
  public todo!: Todo

  updateTodo() {
    this.loader = true
    let id = this.todo ? this.todo.id : undefined
    backendService
    .updateTodo(this.todo.value, id)
    .then(todo => {
      this.loader = false
      this.todo = todo
      
      for(let todo of this.todos) {
        if(todo.id == this.todo.id) {
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
