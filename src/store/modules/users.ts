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

    get userId(): number | null {
        return this.user ? this.user.ID : null
    }

    get username() {
        return this.user ? `${this.user.Firstname} ${this.user.Lastname}` : null
    }

    get isLoggedIn(): boolean {
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

    castToUser(): User | null {
        let user = localStorage.getItem('user')
        return user != undefined ? JSON.parse(user) as User : null
    }
}

export default getModule(UsersModule)