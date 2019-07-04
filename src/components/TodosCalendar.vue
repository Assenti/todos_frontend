<template>
    <div>
        <v-toolbar dense dark flat color="teal">
            <v-toolbar-title>
                Todo Calendar                
            </v-toolbar-title>
            <v-spacer/>
            <div>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                    <v-btn flat icon dark
                        v-on="on"
                        @click="hideCalendar">
                        <v-icon>close</v-icon>
                    </v-btn>
                    </template>
                    <span>Hide Calendar</span>
                </v-tooltip>
            </div>
        </v-toolbar>
        <v-calendar :weekdays="[1,2,3,4,5,6,0]"
            v-model="currentDayOnCalendar" 
            ref="calendar"
            type="month"
            :start="new Date().toISOString().substr(0, 10)"
            :now="new Date().toISOString().substr(0, 10)"
            color="teal">
            <template v-slot:day="{ date }">
                <v-sheet color="teal" v-if="hasDateTodos(date)">
                    <v-layout justify-center>
                        <v-menu open-on-hover
                            :close-on-content-click="false"
                            :nudge-width="200"
                            offset-y 
                            transition="scale-transition">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" color="white">assignment</v-icon>
                            </template>

                            <v-card>
                                <div class="pt-2 px-3 font-weight-bold">
                                    Todo list for {{ new Date(date).toISOString().substr(0, 10) }}:
                                </div>
                                <v-divider/>
                                <v-list dense>
                                    <v-list-tile
                                        v-for="(todo, i) in returnTodosOfDate(date)" 
                                        :key="i">
                                        <v-list-tile-content>
                                            <v-list-tile-title>{{ i + 1}}) {{ todo.Value }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </v-layout>
                </v-sheet>
            </template>
        </v-calendar>
        <v-footer height="auto"
            class="px-2" dark
            color="teal">
            <v-layout align-center justify-space-between>
                <v-btn small flat @click="$refs.calendar.prev()">
                    <v-icon>keyboard_arrow_left</v-icon>
                    Prev
                </v-btn>
                <v-btn small flat @click="$refs.calendar.next()">
                    <v-icon>keyboard_arrow_right</v-icon>
                    Next
                </v-btn>
            </v-layout>
        </v-footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { bus } from '@/main'
import { Todo } from '@/models/Todo'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'

@Component({
  components: {
  }
})
export default class TodosCalendar extends Vue {
    loading: boolean = false
    currentDayOnCalendar: string = ''
    todos: Todo[] = todos.getTodos
    todosMenu: boolean = false

    created() {
        
    }

    hasDateTodos(date: string): boolean {
        for(const todo of this.todos) {
            if(new Date(todo.CreatedAt).toDateString() === new Date(date).toDateString()) {
                return true
            }
        }
        return false
    }

    returnTodosOfDate(date: string): Todo[] {
            console.log(date)

        let existTodos: Todo[] = []
        for(const todo of this.todos) {
            if(new Date(todo.CreatedAt).toDateString() === new Date(date).toDateString()) {
                existTodos.push(todo)
            }
        }
        return existTodos
    }

    hideCalendar() {
        bus.$emit('hideCalendar')
    }

}
</script>

<style lang="scss" scoped>
.this-event {
    position: absolute;
}
</style>