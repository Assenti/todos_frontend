<template>
    <v-layout column class="this-todos">

        <v-toolbar dense dark flat color="blue-grey">
            <v-layout align-center justify-space-between>
                <v-toolbar-title class="text-truncate">{{ chosenTodo.value }}</v-toolbar-title>
                <div>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn class="ml-1" text icon v-on="on"
                            @click="closeDetails">
                            <v-icon small>close</v-icon>
                            </v-btn>
                        </template>
                        <span>Close</span>
                    </v-tooltip>
                </div>
            </v-layout>
        </v-toolbar>
      
        <div class="this-todos-list">
            <div class="this-editor">
                <div class="this-editor-toolbar">
                    <v-btn-toggle v-model="alignment">
                        <v-btn flat>
                            <v-icon>format_align_left</v-icon>
                        </v-btn>
                        <v-btn flat>
                            <v-icon>format_align_center</v-icon>
                        </v-btn>
                        <v-btn flat>
                            <v-icon>format_align_right</v-icon>
                        </v-btn>
                        <v-btn flat>
                            <v-icon>format_align_justify</v-icon>
                        </v-btn>
                    </v-btn-toggle>

                    <v-divider vertical class="mx-2"/>

                    <v-btn-toggle v-model="fontStyles" multiple>
                        <v-btn flat>
                            <v-icon>format_bold</v-icon>
                        </v-btn>
                        <v-btn flat>
                            <v-icon>format_italic</v-icon>
                        </v-btn>
                        <v-btn flat>
                            <v-icon>format_underlined</v-icon>
                        </v-btn>
                    </v-btn-toggle>

                    <v-divider vertical class="mx-2"/>

                    <v-btn-toggle v-model="listType">
                        <v-btn flat>
                            <v-icon>format_list_bulleted</v-icon>
                        </v-btn>
                        <v-btn flat>
                            <v-icon>format_list_numbered</v-icon>
                        </v-btn>
                    </v-btn-toggle>

                </div>
                <textarea type="text"
                    placeholder="Write your staff here..." 
                    v-model="editorData" />
                    
            </div>
            <v-layout>
                <v-spacer/>
                <v-btn flat color="primary"
                    :loading="loader"
                    @click="save">
                    save
                    <v-icon small class="ml-1">save</v-icon>
                </v-btn>
            </v-layout>
        </div>

        <v-footer height="auto"
            class="px-2" dark
            color="blue-grey">
        </v-footer>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Todo, Detail } from '@/models/Todo'
import EditTodo from '@/components/EditTodo.vue'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backend'
import { api } from '@/store/api'
import { bus } from '@/main'
const backendService = new BackendService()

@Component({
  components: {
    EditTodo
  }
})
export default class TodoDetails extends Vue {
    todo: string = ''
    dialog: boolean = false
    loader: boolean = false
    editorData: string = ''
    details?: Detail
    alignment: number = 0
    listType: number | null = null
    fontStyles: number[] = []
    

    @Prop({type: Object as () => Todo})
    public chosenTodo!: Todo

    created() {
        bus.$on('finishEdit', () => {
            this.dialog = false
        })
    }
  
    mounted() {
        this.getDetails()
    }

    closeDetails() {
        bus.$emit('closeTodoDetails')
    }

    async getDetails() {
        try {
            this.loader = true
            const { data } = await api.get(`/api/details?todoid=${this.chosenTodo.id}`)
            this.details = data.details[0] as Detail
            this.editorData = this.details ? this.details.content : ''
        }
        catch (e) {
            console.log(e)
            bus.$emit('toast', 'Error ocurred while fetching todo details')
        }
        finally {
            this.loader = false
        }
    }

    save() {
        if(this.details && this.details!.id) {
            this.editDetails()
        }
        else {  
            this.saveChanges()
        }
    }

    async saveChanges() {
        try {
            this.loader = true
            const payload = {
                Content: this.editorData,
                TodoID: this.chosenTodo.id
            }

            const { data } = await api.post(`/api/details`, payload)
            bus.$emit('toast', 'Details successfully saved')
        }
        catch (e) {
            console.log(e)
            bus.$emit('toast', 'Error ocurred while creating todo details')
        }
        finally {
            this.loader = false
        }
    }
    
    async editDetails() {
        try {
            this.loader = true
            const payload = {
                Content: this.editorData,
                TodoID: this.details!.todoId,
                ID: this.details!.id
            }
            const { data } = await api.put(`/api/details`, payload)
            this.details = data.detail as Detail
            this.editorData = this.details.content
            bus.$emit('toast', 'Details successfully edited')
        }
        catch (e) {
            console.log(e)
            bus.$emit('toast', 'Error ocurred while editing todo details')
        }
        finally {
            this.loader = false
        }
    }

    castToBool(value: number): boolean {
        return value == 0 ? false : true
    }

}
</script>

<style lang="scss">
.this-todos {
  max-height: calc(100vh - 64px);
  height: calc(100% - 64px);
  background-color: white;
  overflow-y: none;
}
.this-todos-list {
  max-height: calc(100% - 64px);
  height: calc(100% - 64px);
  overflow-y: auto;
}
.completed {
  text-decoration: line-through;
}
.this-list-item {
  outline-offset: -1px;
  outline: 1px solid transparent !important;

  &:hover {
    outline: 1px solid #607D8B !important;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, .3);
  }
}

.this-editor {
    min-height: 400px;

    & > textarea {
        min-height: 355px;
        width: 100%;
        outline: none;
        padding: 10px;

        &::placeholder {
            color: #909090;
        }
    }
}

.this-editor-toolbar {
    height: 45px;
    display: flex;
    align-items: center;
    // background-color: #f7f7f7;
    border-bottom: 1px solid grey;
    padding: 0 10px;
}
</style>
