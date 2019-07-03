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
        let decodedString = decode(user_)
        localStorage.setItem('user', user_)
        let user = decodedString ? JSON.parse(decodedString) : null
        return { user } 
    }

    @MutationAction
    async logout() {
        localStorage.removeItem('user')
        return {}
    }
    
    castToUser(): User | null {
        let encodedString = localStorage.getItem('user')
        let decodedString = decode(encodedString)
        let user = decodedString ? JSON.parse(decodedString) : null
        return user ? user as User : null
    }
}

function decode(input: string | null): string | null {
    let _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let output = ''
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let i = 0
    
    if(input) {
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++))
            enc2 = _keyStr.indexOf(input.charAt(i++))
            enc3 = _keyStr.indexOf(input.charAt(i++))
            enc4 = _keyStr.indexOf(input.charAt(i++))

            chr1 = (enc1 << 2) | (enc2 >> 4)
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            chr3 = ((enc3 & 3) << 6) | enc4

            output = output + String.fromCharCode(chr1)

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2)
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }
        return output
    }
    else return null
}

export default getModule(UsersModule)