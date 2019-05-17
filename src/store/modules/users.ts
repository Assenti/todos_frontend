import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { User, UserSubmit } from '@/models/User'

@Module({
    namespaced: true,
    name: 'users',
    store,
    dynamic: true
})

class UsersModule extends VuexModule {
    user: User | null = this.castToUser() || null

    get username() {
        return this.user ? `${this.user.firstname} ${this.user.lastname}` : null
    }

    get isLoggedIn() {
        return this.user !== null ? true : false
    }

    @MutationAction
    async login(user: User) {
        localStorage.setItem('user', JSON.stringify(user))
        return { user }
    }

    @MutationAction
    async logout() {
        localStorage.removeItem('user')
        return {}
    }

    castToUser(): User {
        return JSON.parse(localStorage.getItem('user')) as User
    }
}

export default getModule(UsersModule)