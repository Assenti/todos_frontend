import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store'
import { User, UserSubmit } from '@/models/User'
import { loginUser } from '../api';

@Module({
    namespaced: true,
    name: 'users',
    store,
    dynamic: false
})
class UsersModule extends VuexModule {
    user: User | null = null

    get username() {
        return this.user ? `${this.user.firstname} ${this.user.lastname}` : null
    }

    @Mutation
    setUser(user: User) { this.user = user }

    @Action({ commit: 'setUser' })
    async login(userSubmit: UserSubmit) {
        const user = await loginUser(userSubmit)
        console.log(user)
        return user
    }
}

export default getModule(UsersModule)