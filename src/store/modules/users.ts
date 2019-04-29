import { VuexModule, Module, getModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store'
import { User, UserSubmit } from '@/models/User'
import { loginUser } from '../api';

@Module({
    namespaced: true,
    name: 'users',
    store
})
class UsersModule extends VuexModule {
    user: User | null = null

    @MutationAction({ mutate: ['user']})
    async login(userSubmit: UserSubmit) {
        const user = await loginUser(userSubmit)
        return { user }
    }
}

export default getModule(UsersModule)