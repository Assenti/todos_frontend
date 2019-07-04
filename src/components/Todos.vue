<template>
    <v-layout column class="this-todos">
      <v-toolbar dense dark flat color="teal">
        <v-toolbar-title>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn flat icon dark
                class="mr-2" v-on="on"
                @click="openCalendar">
                <v-icon>date_range</v-icon>
              </v-btn>
            </template>
            <span>Open Calendar</span>
          </v-tooltip>
         
        </v-toolbar-title>

        <v-spacer/>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"
              @click="searchMenu = !searchMenu">
              <v-icon>search</v-icon>
            </v-btn>
          </template>
          <span>Search todo</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"
              @click="getTodos">
              <v-icon>refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh todos</span>
        </v-tooltip>

        <v-menu bottom left offset-y min-width="300"> 
            <template v-slot:activator="{ on }">
              <v-btn icon
                v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <v-list avatar dense>
              <v-list-tile
                v-for="(item, i) in actions"
                :key="i"
                @click="item.action">
                <v-list-tile-avatar>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>
                    {{ item.title }}
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

        <v-list two-line dense>
          <template v-for="(todo, index) in filteredTodos">
            <v-list-tile
              :key="`todo-${index}`"
              class="this-list-item animated bounceInUp fast"
              @click="voidFunc">
              <v-list-tile-avatar class="mx-0 px-0">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn flat
                      icon v-on="on"
                      class="mx-0 px-0"
                      :loading="loader"
                      :color="todo.Completed == 1 ? 'green' : ''"
                      @click="toggleCompletion(todo, index)">
                      <v-icon>check_circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Completion Indicator</span>
                </v-tooltip>
              </v-list-tile-avatar>
              <v-list-tile-avatar class="mx-0 px-0">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn flat
                      icon v-on="on"
                      :disabled="castToBool(todo.Completed)"
                      class="mx-0 px-0"
                      :loading="loader"
                      :color="todo.Important == 1 ? 'red' : ''"
                      @click="toggleImportance(todo, index)">
                      <v-icon>flag</v-icon>
                    </v-btn>
                  </template>
                  <span>Importance Indicator</span>
                </v-tooltip>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title :class="{'completed': todo.Completed}">
                  {{ todo.Value }}</v-list-tile-title>
                <v-list-tile-sub-title class="caption"
                  :class="{'completed': todo.Completed}">
                  created at: {{ new Date(todo.CreatedAt).toISOString().substr(0, 10) }}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                  <v-layout>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn icon
                              v-on="on"
                              flat right
                              :disabled="todo.Completed == 1 ? true : false "
                              @click="editTodo(todo)"
                              ripple>
                              <v-icon small>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit todo</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn icon
                              flat v-on="on"
                              @click="deleteTodo(todo, index)"
                              ripple>
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
        color="teal">
        <v-layout align-center justify-space-between>
          <div>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"
                  class="mr-3" 
                  @click="completedOnly = !completedOnly">
                  <v-icon>check_circle</v-icon>
                </v-btn>
              </template>
              <span>Show Completed Only</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"
                  @click="importantOnly = !importantOnly">
                  <v-icon>flag</v-icon>
                </v-btn>
              </template>
              <span>Show Important Only</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"
                  @click="importantOnly = completedOnly = false">
                  <v-icon>format_align_justify</v-icon>
                </v-btn>
              </template>
              <span>Show All</span>
            </v-tooltip>
          </div>
          <div class="px-2">
            <span class="body-1 white--text">All Tasks: {{ todos.length }}</span>
            <span class="body-1 white--text mx-2">|</span>
            <span class="body-1 white--text">Remaining: {{ todos.length - todosCompletionScore }}</span>
          </div>
          <!-- <div>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"
                  @click="deleteCompleted">
                  <v-icon>delete_forever</v-icon>
                </v-btn>
              </template>
              <span>Delete All Completed</span>
            </v-tooltip>
          </div> -->
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

      <v-dialog v-model="dialog"
        min-width="400px"
        width="50%">
        <edit-todo/>
      </v-dialog>

      <v-dialog
        v-model="sendingLoader"
        hide-overlay
        persistent
        width="300">
          <v-card dark
              color="teal">
              <v-card-text>
                  Sending...
                  <v-progress-linear
                      indeterminate
                      color="white"
                      height="3"
                      class="mb-0"
                  />
              </v-card-text>
          </v-card>
        </v-dialog>

    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import EditTodo from '@/components/EditTodo.vue'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { bus } from '@/main'
const backendService = new BackendService()

@Component({
  components: {
    EditTodo
  }
})
export default class Todos extends Vue {
  todos: Todo[] = todos.getTodos
  todo: string = ''
  dialog: boolean = false
  snackbar: boolean = false
  notify: string = ''
  loader: boolean = false
  searchMenu: boolean = false
  search: string = ''
  completedOnly: boolean = false
  importantOnly: boolean = false
  sendingLoader: boolean = false
  calendarView: boolean = false
  actions: object[] = [
      {
          title: 'Send via Email',
          icon: 'email',
          action: this.sendViaEmail
      }
  ]

  created() {
    bus.$on('toast', (message: string) => {
      this.snackbar = true
      this.notify = message
    })
    bus.$on('finishEdit', () => {
      this.dialog = false
    })
    bus.$on('refreshTodos', (todos: Todo[]) => {
        this.todos = todos
    })
  }
  
  mounted() {
    setTimeout(() => {
      if(todos.getTodos.length == 0 && users.isLoggedIn) this.getTodos() 
    }, 1000)
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
    else if(this.completedOnly) {
      return this.todos.filter(todo => {
        return todo.Completed
      })
    }
    else if(this.importantOnly) {
      return this.todos.filter(todo => {
        return todo.Important
      })
    }
    else {
      return this.todos
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

  editTodo(todo: Todo) {
      bus.$emit('editTodo', todo)
      this.dialog = true
  }

  deleteCompleted() {
      
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

  async deleteTodo(todo: Todo, index: number) {
    try {
      this.loader = true
      await backendService.deleteTodo(todo)
      let id = this.todos[index].ID
      this.todos = this.todos.filter(todo => {
        return todo.ID != id
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
      this.sendingLoader = true
      backendService.sendTodosViaEmail(this.todos)
      .then(() => {
        this.sendingLoader = false
      })
  }

  voidFunc() {}

}
</script>

<style lang="scss">
.this-todos {
  max-height: calc(100vh - 48px);
  overflow-y: none;
}
.this-todos-list {
  max-height: calc(100% - 48px);
  overflow-y: auto;
}
.completed {
  text-decoration: line-through;
}
.this-list-item {
  outline-offset: -1px;
  outline: 1px solid transparent !important;
  &:hover {
    background-color: #E0F2F1 !important;
    outline: 1px solid #009688 !important;
  }
}
</style>
