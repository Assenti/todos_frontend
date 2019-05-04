import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'
import { Todo, TodosResponse } from '@/models/Todo'

@Module({
    namespaced: true,
    name: 'todos',
    store,
    dynamic: true
})
class TodosModule extends VuexModule {
    // todos: Todo[]

    // get getTodos() {
    //     return this.todos
    // }

    // @Mutation
    // setUser(user: User) { this.user = user }

    // @Action({ commit: 'setUser' })
    // async login(userSubmit: UserSubmit) {
    //     const user = await loginUser(userSubmit)
    //     return user
    // }
}

// export default getModule(UsersModule)