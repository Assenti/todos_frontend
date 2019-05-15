import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { User, UserSubmit } from '@/models/User'
import { loginUser, setJWT } from '../api'

@Module({
    namespaced: true,
    name: 'users',
    store,
    dynamic: true
})
class UsersModule extends VuexModule {
    user: User | null = null

    get username() {
        return this.user ? `${this.user.firstname} ${this.user.lastname}` : null
    }

    get isLoggedIn() {
        return this.user
    }

    @MutationAction
    async login(userSubmit: UserSubmit) {
        const user = await loginUser(userSubmit)
        localStorage.setItem('session', JSON.stringify(user))
        return { user }
    }
}

export default getModule(UsersModule)