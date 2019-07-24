import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import 'animate.css'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(Vuetify, {
  iconfont: 'md'
})
export const bus = new Vue()

new Vue({
  router,
  store,
  vuetify: new Vuetify({}),
  render: h => h(App)
}).$mount('#app')
