<template>
    <v-layout column>
      <div class="title text-xs-center py-2">Your todos...</div>
      <v-text-field
        v-model="todo"
        prepend-inner-icon="assignment"
        clearable
        append-icon="add_box"
        @click:append="add"
        @keyup.enter="add"
        required
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
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import { api, setJWT } from '@/store/api'
import users from '@/store/modules/users'

@Component({
  components: {
    
  }
})
export default class Todos extends Vue {
  todos: Todo[] = []
  todo: string = ''

  mounted() {
   this.getTodos() 
  }

  getTodos() {
    api.get(`/usertodos?userid=${users.userId}`)
    .then(response => {
      this.todos = response.data.todos
    })
    .catch(err => {

    })
  }

  add() {

  }

  voidFunc() {}

}
</script>
