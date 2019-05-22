import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { Todo, TodosResponse } from '@/models/Todo'

@Module({
    namespaced: true,
    name: 'todos',
    store,
    dynamic: true
})
class TodosModule extends VuexModule {
    todos: Todo[] = []

    get getTodos() {
        return this.todos
    }

    @MutationAction
    async setTodos(todos: Todo[]) {
        return { todos }
    }
}

export default getModule(TodosModule)