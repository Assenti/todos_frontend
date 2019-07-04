import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { User, UserSubmit } from '@/models/User'
import { Decoder } from '@/services/decoder'
const decoder = new Decoder()

@Module({
    namespaced: true,
    name: 'users',
    store,
    dynamic: true
})

class UsersModule extends VuexModule {
    user: User | null = this.castToUser() || null
    
    get userId(): number | null {
        return this.user ? this.user.id : null
    }

    get getToken(): string | null {
        return this.user ? this.user.token : null
    }

    get getUser(): User | null {
        return this.user
    }

    get getAvatar(): string | null {
        return this.user ? this.user.avatar : null
    }

    get username() {
        return this.user ? `${this.user.firstname} ${this.user.lastname}` : null
    }

    get userEmail() {
        return this.user ? this.user.email : null
    } 

    get registeredDate() {
        return this.user ? new Date(this.user.createdAt).toLocaleDateString() : null
    }

    get isLoggedIn(): boolean {
        if(this.user) {
            return this.user.token != null
        }
        else return false
    }

    @MutationAction
    async login(user_: string) {
        let decodedString
        try {
            decodedString = decoder.decode(JSON.stringify(user_))
        }
        catch (e) { 
            console.log(e)
        }

        if(decodedString) {
            localStorage.setItem('user', user_)
            let user = decodedString ? JSON.parse(decodedString) : null
            return { user } 
        }
        else return { }
    }

    @MutationAction
    async logout() {
        localStorage.removeItem('user')
        return {}
    }
    
    castToUser(): User | null {
        let encodedString = localStorage.getItem('user')
        let decodedString
        try {
            decodedString = encodedString ? decoder.decode(JSON.stringify(encodedString)) : null
        }
        catch (e) {
            console.log(e)
        }
        let user = decodedString ? JSON.parse(decodedString) : null
        return user ? user as User : null
    }
}

export default getModule(UsersModule)