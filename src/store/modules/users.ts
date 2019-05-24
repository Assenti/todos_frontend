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
    token: string | null = localStorage.getItem('token')

    get userId(): number | null {
        return this.user ? this.user.ID : null
    }

    get getToken(): string | null {
        return this.token
    }

    get username() {
        return this.user ? `${this.user.Firstname} ${this.user.Lastname}` : null
    }

    get userEmail() {
        return this.user ? this.user.Email : null
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
    async session(token: string) {
        localStorage.setItem('token', JSON.stringify(token))
        return { token }
    }

    @MutationAction
    async logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        return {}
    }

    castToUser(): User | null {
        let user = localStorage.getItem('user')
        return user != undefined ? JSON.parse(user) as User : null
    }
}

export default getModule(UsersModule)