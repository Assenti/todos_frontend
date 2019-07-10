import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'animate.css'
import VeeValidate from 'vee-validate'
import * as CKEditor from '@ckeditor/ckeditor5-vue'

Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(CKEditor)
export const bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
