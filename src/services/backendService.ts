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
                users.session(response.data.token)
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

    passwordRestore(email: string) {
        return new Promise(resolve => {
            api.get(`/restorepassword?email=${email}`)
            .then(response => {
                resolve()
                bus.$emit('notify', 'New password was generated! Check your Email, please')
            })
            .catch(err => {
                console.log(err)
                bus.$emit('notify', 'Invalid Email')
                resolve()
            })
        })
    }

    passwordChange(user: User) {
        return new Promise(resolve => {
            api.post(`/changepassword`, user)
            .then(response => {
                resolve()
                bus.$emit('notify', 'New password was generated! Check your Email, please')
            })
            .catch(err => {
                console.log(err)
                bus.$emit('notify', err.response.data.message ? err.response.data.message : err.message)
                resolve()
            })
        })
    }

    passwordCheck(user: User) {
        return new Promise(resolve => {
            api.post('/checkpassword', user)
            .then(response => {
                resolve()
                bus.$emit('notify', 'Password successfully checked')
            })
            .catch(err => {
                console.log(err)
                bus.$emit('notify', err.response.data.message ? err.response.data.message : err.message)
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

    updateTodo(value: string, id: number | undefined): Promise<Todo> {
        return new Promise(resolve => {
            if(!id) {
                resolve()
                bus.$emit('toast', 'Todo id is not passed correctly')
            }
            else {
                let data = {
                    Value: value,
                    ID: id
                }
                
                api.put('/todos', data)
                .then(response => {
                    resolve(response.data.todo)
                    bus.$emit('toast', 'Todo successfully updated')
                })
                .catch(err => {
                    console.log(err)
                    resolve()
                    bus.$emit('toast', 'Error ocurred while sending new todo')
                })
            }
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

    sendTodosViaEmail(todos: Todo[]) {
        return new Promise(resolve => {
            console.log(todos)
            
            api.post(`/sendViaEmail?email=${users.userEmail}`, todos)
            .then(response => {
                resolve()
                bus.$emit('toast', 'Successfully sent')
            })
            .catch(err => {
                console.log(err)
                resolve()
                bus.$emit('toast', 'Error ocurred while sending todos list')
            })
        })
    }
}

export default BackendService