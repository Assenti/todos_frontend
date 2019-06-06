<template>
    <div class="account">
        <v-layout>
            <v-navigation-drawer
                v-model="drawer"
                :mini-variant.sync="screenSize"
                hide-overlay
                stateless
                height="100%">
                <v-toolbar flat height="170px">
                    <v-layout class="hidden-xs-only" justify-center align-center>
                       <div class="this-avatar">
                            <img src="../assets/rawpixel-579231-unsplash.jpg" alt="">
                            <div>
                                {{ avatarSetInd }}
                                <v-btn icon flat
                                    @click="setAvatar">
                                    <v-icon>file_upload</v-icon>
                                </v-btn>
                            </div>
                        </div>
                    </v-layout>
                    <v-btn flat icon @click="screenSize = !screenSize">
                        <v-icon>chevron_left</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-divider class="hidden-xs-only"/>
                <v-list class="pt-0">
                    <v-list-tile v-for="(item, index) in sections" 
                        :key="index" :dark="current == item.name"
                        :class="{'teal': current === item.name}"
                        @click="switchSection(item.name)">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title :class="{'white--text': current === item.name}">
                                {{ item.title }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-layout>
                <component :is="current"/>
            </v-layout>
        </v-layout>

        <v-dialog min-width="320px" v-model="avatarMenu">
            <v-card flat>
                <v-card-title class="title">
                    <v-icon class="mr-2">face</v-icon>
                    Set Avatar
                </v-card-title>
                <v-card-text>
                    <div class="this-avatar-upload">
                        <div>
                            <v-icon>file_upload</v-icon>
                            Upload image <small>(allowed: .jpg, .png)</small>
                            <br>{{ fileName }}
                        </div>
                        <input type="file" 
                            ref="file"
                            @change="selectFile"
                            accept="image/jpg, image/png">
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Todo } from '@/models/Todo'
import ChangePassword from '@/components/ChangePassword.vue'
import AccountInfo from '@/components/AccountInfo.vue'
import users from '@/store/modules/users'
import todos from '@/store/modules/todos'
import BackendService from '@/services/backendService'
import { bus } from '@/main'
import { User } from '../models/User'
const backendService = new BackendService()

@Component({
  components: {
    ChangePassword, AccountInfo
  }
})
export default class Account extends Vue {
    dialog: boolean = false
    alert: boolean = false
    message: string = ''
    loader: boolean = false
    loading: boolean = false
    password: string = ''
    newPassword: string = ''
    correctPassword: boolean = false
    avatarMenu: boolean = false
    fileName: string = 'Click to choose or Drag&Drop'
    file: object = {}
    screenSize: boolean = false
    drawer:boolean = true
    current: string = 'AccountInfo'
    sections: object[] = [
        {
            title: 'Account',
            icon: 'account_circle',
            name: 'AccountInfo'
        },
        {
            title: 'Change Password',
            icon: 'lock',
            name: 'ChangePassword'
        }
    ]

    created() {
        bus.$on('notify', (message: string) => {
            this.alert = true
            this.message = message
            setTimeout(() => {
                this.alert = false
                this.message = ''
            }, 3000)
        })
    }
  
    mounted() {
        
    }

    // watch() {
    //     screenSize: {
    //         if(window.innerWidth <= 700) this.screenSize = true
    //         else this.screenSize = false
    //     }
    // }

    checkPassword() {
        this.loader = true
        let data = {
            ID: users.userId,
            Email: users.userEmail,
            Password: this.password
        }
        backendService
        .passwordCheck(data as User)
        .then(() => {
            this.loader = false
            this.correctPassword = true
        })
    }

    change() {
        this.loading = true
        let data = {
            ID: users.userId,
            Email: users.userEmail,
            Password: this.newPassword
        }
        backendService
        .passwordChange(data as User)
        .then(() => {
            this.loading = false
        })
    }

    switchSection(section: string) {
        this.current = section
    }

    setAvatar() {
        this.avatarMenu = !this.avatarMenu
    }

    selectFile() {
        this.file = this.$refs.file.files[0]
        this.fileName = `${this.$refs.file.files[0].name} (${(this.$refs.file.files[0].size / 1024 / 1024).toFixed(1)} MB)`
        console.log(this.file)
    }

    close() {
        bus.$emit('closeAccount')
    }

    get avatarSetInd(): string {
        if(users.getAvatar) return 'Change avatar'
        else return 'Set avatar'
    }
}
</script>

<style>
.account {
    min-height: calc(100vh - 48px);
}
.this-avatar {
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
} 
.this-avatar img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
.this-avatar > div {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #B2DFDB;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 1.5s ease;
}
.this-avatar:hover > div {
    display: flex;
}
.this-avatar-upload {
    width: 95%;
    height: 300px;
    margin: 10px auto;
    border: 2px dashed #4d4d4d;
    border-radius: 2px;
    background-color: #e7e7e7;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    position: relative;
}
.this-avatar-upload > div {
    position: absolute;
    font-size: 18px;
    height: 45px;
    top: calc(50% - 23px);
    text-align: center;
}
.this-avatar-upload > input {
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
</style>
