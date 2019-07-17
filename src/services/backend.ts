import { api, setJWT } from '../store/api'
import { User, UserSubmit } from '@/models/User'
import { Todo, Detail, TodoType } from '@/models/Todo'
import { Group, AllGroups } from '@/models/Group'
import { bus } from '@/main'
import users from '../store/modules/users'
import todos from '../store/modules/todos'

class BackendService {
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
        return new Promise(async (resolve, reject) => {
            try {
                await api.post(`api/changepassword`, user)
                resolve()
            }
            catch (e) {
                console.log(e)
                let msg = e.response.data.message ? e.response.data.message : e.message
                reject(msg)
            }
        })
    }

    passwordCheck(user: User) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('api/checkpassword', user)
                resolve()
            }
            catch (e) {
                console.log(e)
                let msg = e.response.data.message ? e.response.data.message : e.message
                reject(msg)
            }
        })
    }

    // Fetching logged on user todos
    fetchTodosList(): Promise<Todo[]> {
        return new Promise(async (resolve, reject) => {
            
            try {
                const { data } = await api.get(`api/usertodos?userid=${users.userId}`)
                let receivedTodos = data.todos 
                if(receivedTodos.length == 0) {
                    resolve([])
                    bus.$emit('toast', 'You todos list is empty')
                }
                else {
                    resolve(receivedTodos as Todo[])
                    todos.setTodos(receivedTodos as Todo[])
                }
                // let dates = response.data.dates  
                // todos.setTodosDates(dates as Date[])
            }
            catch (e) {
                bus.$emit('toast', 'Error ocurred while downloading todos list')
                reject(e)
            }
        })
    }

    // Fetching logged on user todos
    fetchGroupsTodosList(groupId: number): Promise<Todo[]> {
        return new Promise(async (resolve, reject) => {
            
            try {
                const { data } = await api.get(`api/grouptodos?groupId=${groupId}`)
                let receivedTodos = data.todos 
                if(receivedTodos.length == 0) {
                    resolve([])
                    bus.$emit('toast', 'Group todos list is empty')
                }
                else {
                    resolve(receivedTodos as Todo[])
                    todos.setTodos(receivedTodos as Todo[])
                }
            }
            catch (e) {
                bus.$emit('toast', 'Error ocurred while downloading todos list')
                reject(e)
            }
        })
    }

    // Add new todo to todos list
    addTodo(todo: string, groupId?: number): Promise<Todo> {
        return new Promise(async (resolve, reject) => {
            let credentials = {
                Value: todo,
                UserID: users.userId,
                GroupID: 999999999
            }

            if(groupId) {
                credentials.GroupID = groupId
            }
            
            try {
                const { data } = await api.post('api/todos', credentials)
                resolve(data.todo)
            }
            catch (e) {
                reject(e)
                bus.$emit('toast', 'Error ocurred while creating new todo')
            }
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
                    bus.$emit('toast', 'Error ocurred while updating todo')
                })
            }
        })
    }

    toggleImportance(todo: Todo): Promise<Todo> {
        return new Promise(resolve => {
            api.get(`api/todoimportance?id=${todo.id}`)
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
            api.get(`api/todocompletion?id=${todo.id}`)
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
        return new Promise(async (resolve, reject) => {
            try {
                await api.delete(`api/todos?id=${todo.id}`)
                resolve('success')
            }
            catch (e) {
                reject(e)
                bus.$emit('toast', 'Error ocurred while deleting todo')
            }
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

    getAllGroups(): Promise<AllGroups> {
        return new Promise(async (resolve, reject) => {
            try {
                const groups = await api.get(`/api/groups?userid=${users.userId}`)
                const groupsIn = await api.get(`/api/groupsParticipate?userid=${users.userId}`)
                let handledGroupsIn: Group[] = []

                if(groupsIn.data.groups.length > 0) {
                    for(const g of groupsIn.data.groups) {
                        handledGroupsIn.push({
                            id: g.id,
                            name: g.name,
                            createdAt: g.createdAt,
                            userId: g.userid,
                            participate: true
                        })
                    }
                }

                resolve({
                    groups: groups.data.groups,
                    groupsIn: handledGroupsIn
                })
            }
            catch (e) {
                reject(e)
            }
        })
    }
}

export default BackendService