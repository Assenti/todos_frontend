<template>
    <v-card class="mb-1">
        <v-app-bar dense dark flat color="blue-grey">
            <v-toolbar-title>
                Todos Calendar                
            </v-toolbar-title>
            <v-spacer/>
            <div>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                    <v-btn text icon dark
                        v-on="on" small
                        @click="hideCalendar">
                        <v-icon small>close</v-icon>
                    </v-btn>
                    </template>
                    <span>Hide Calendar</span>
                </v-tooltip>
            </div>
        </v-app-bar>
        <v-calendar :weekdays="[1,2,3,4,5,6,0]"
            v-model="currentDayOnCalendar" 
            ref="calendar"
            type="month"
            :start="new Date().toISOString().substr(0, 10)"
            :now="new Date().toISOString().substr(0, 10)"
            color="primary">
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
                                <div class="blue-grey white--text py-2 px-3">
                                    Todo list for {{ new Date(date).toISOString().substr(0, 10) }}:
                                </div>
                                <v-divider/>
                                <v-list dense class="py-0">
                                    <template v-for="(todo, i) in returnTodosOfDate(date)">
                                        <v-list-item
                                            @click="voidFunc"
                                            :key="`date-todo-${i}`">
                                            <v-list-item-content>
                                                <v-list-item-title>{{ i + 1}}) {{ todo.value }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-divider :key="i"/>
                                    </template>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </v-layout>
                </v-sheet>
            </template>
        </v-calendar>
        <v-footer height="auto"
            class="px-2" dark
            color="blue-grey">
            <v-layout align-center justify-space-between>
                <v-btn small text @click="$refs.calendar.prev()">
                    <v-icon>keyboard_arrow_left</v-icon>
                    Prev
                </v-btn>
                <v-btn small text @click="$refs.calendar.next()">
                    <v-icon>keyboard_arrow_right</v-icon>
                    Next
                </v-btn>
            </v-layout>
        </v-footer>
    </v-card>
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
            if(new Date(todo.createdAt).toDateString() === new Date(date).toDateString()) {
                return true
            }
        }
        return false
    }

    returnTodosOfDate(date: string): Todo[] {
        let existTodos: Todo[] = []
        for(const todo of this.todos) {
            if(new Date(todo.createdAt).toDateString() === new Date(date).toDateString()) {
                existTodos.push(todo)
            }
        }
        return existTodos
    }

    hideCalendar() {
        bus.$emit('hideCalendar')
    }

    voidFunc() {}
}
</script>

<style lang="scss" scoped>
.this-event {
    position: absolute;
}
</style>