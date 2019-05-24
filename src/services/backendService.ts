import { api, setJWT } from '../store/api'
import { User, UserSubmit } from '@/models/User'
import { Todo } from '@/models/Todo'
import { bus } from '@/main'
import users from '../store/modules/users'
import todos from '../store/modules/todos'

class BackendService {
    /********************USER METHODS********************/

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
                users.login(response.data.user as User)
                bus.$emit('loggedIn')
                resolve()
            })
            .catch(err => {
                console.log(err)
                bus.$emit('notify', 'Invalid Email or Password')
                resolve()
            })
        })
    }

    /********************TODOS METHODS********************/

    fetchTodosList(): Promise<Todo[]> {
        return new Promise(resolve => {
            api.get(`/usertodos?userid=${users.userId}`)
            .then(response => {
                resolve(response.data.todos as Todo[])
                todos.setTodos(response.data.todos as Todo[])
            })
            .catch(err => {
                resolve()
                bus.$emit('toast', 'Error ocurred while downloading todos list')
            })
        })
    }

    addTodo(todo: string): Promise<Todo> {
        return new Promise(resolve => {
            let data = {
                Value: todo,
                UserID: users.userId
            }
            
            api.post('/todos', data)
            .then(response => {
                resolve(response.data.todo)
            })
            .catch(err => {
                console.log(err)
                resolve()
                bus.$emit('toast', 'Error ocurred while sending new todo')
            })
        })
    }

    toggleImportance(todo: Todo): Promise<Todo> {
        return new Promise(resolve => {
            api.get(`/todoimportance?id=${todo.ID}`)
            .then(response => {
                resolve(response.data.todo as Todo)
            })
            .catch(err => {
                console.log(err)
                resolve()
                bus.$emit('toast', 'Error ocurred while toggling importance')
            })
        })
    }

    toggleCompletion(todo: Todo): Promise<Todo> {
        return new Promise(resolve => {
            api.get(`/todocompletion?id=${todo.ID}`)
            .then(response => {
                resolve(response.data.todo as Todo)
            })
            .catch(err => {
                console.log(err)
                resolve()
                bus.$emit('toast', 'Error ocurred while toggling completion')
            })
        })
    }

    deleteTodo(todo: Todo) {
        return new Promise(resolve => {
            api.delete(`/todos?id=${todo.ID}`)
            .then(response => {
                console.log(response.data)
                resolve('success')
            })
            .catch(err => {
                console.log(err)
                resolve()
                bus.$emit('toast', 'Error ocurred while deleting todo')
            })
        })
    }
}

export default BackendService