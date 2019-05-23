import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { api, setJWT } from '../api'
import { User, UserSubmit } from '@/models/User'
import { bus } from '@/main'

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

    register(user: User) {
        return new Promise(resolve => {
            api.post('/users', user)
            .then(response => {
                console.log(response.data)
                bus.$emit('notify', 'Congratulations! You are successfully registered!')
                resolve()
            })
            .catch(err => {
                console.log(err)
                bus.$emit('notify', 'Error occured while registering')
                resolve()
            })
        })
    }

    signin(user: UserSubmit) {
        return new Promise(resolve => {
            api.post('/login', user)
            .then(response => {
                this.login(response.data as User)
                resolve()
            })
            .catch(err => {
                console.log(err)
                bus.$emit('notify', 'Invalid Email or Password')
                resolve()
            })
        })
    }

    castToUser(): User | null {
        let user = localStorage.getItem('user')
        return user != undefined ? JSON.parse(user) as User : null
    }
}

export default getModule(UsersModule)