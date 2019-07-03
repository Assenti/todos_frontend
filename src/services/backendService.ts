import { api, setJWT } from '../store/api'
import { User, UserSubmit } from '@/models/User'
import { Todo } from '@/models/Todo'
import { bus } from '@/main'
import users from '../store/modules/users'
import todos from '../store/modules/todos'

class BackendService {
    register(user: User) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('api/users', user)
                bus.$emit('notify', 'Congratulations! You are successfully registered!')
                resolve()    
            }
            catch (e) {
                reject(e)
                bus.$emit('notify', 'Error occured while registering')
            }
        })
    }

    signin(user: UserSubmit) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.post('api/login', user)
                if(data) {
                    users.login(data.user)
                    bus.$emit('loggedIn')
                    resolve()
                }
                else {
                    reject()
                    bus.$emit('notify', 'Error occurred while signing in')
                }
            }
            catch (e) {
                reject(e)
                bus.$emit('notify', 'Invalid Email or Password')
            }
        })
    }

    passwordRestore(email: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.get(`api/restorepassword?email=${email}`)
                bus.$emit('notify', 'New password was generated! Check your Email, please')
                resolve()
            }
            catch (e) {
                console.log(e)
                bus.$emit('notify', 'Invalid Email')
                reject(e)
            }
        })
    }

    passwordChange(user: User) {
        return new Promise(resolve => {
            api.post(`api/changepassword`, user)
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
            api.post('api/checkpassword', user)
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
            api.get(`api/usertodos?userid=${users.userId}`)
            .then(response => {
                let receivedTodos = response.data.todos 
                // let dates = response.data.dates  
                resolve(receivedTodos as Todo[])
                todos.setTodos(receivedTodos as Todo[])
                // todos.setTodosDates(dates as Date[])
            })
            .catch(err => {
                console.log(err)
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
            
            api.post('api/todos', data)
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
                
                api.put('api/todos', data)
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
            api.get(`api/todoimportance?id=${todo.ID}`)
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
            api.get(`api/todocompletion?id=${todo.ID}`)
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
            api.delete(`api/todos?id=${todo.ID}`)
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
            
            api.post(`api/sendViaEmail?email=${users.userEmail}`, todos)
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