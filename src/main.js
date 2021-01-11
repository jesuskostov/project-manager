import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { BootstrapVue } from 'bootstrap-vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Axios from 'axios'

Vue.use(BootstrapVue)
Vue.use(Axios)

Vue.config.productionTip = false

export const bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
