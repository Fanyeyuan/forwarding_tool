import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios'
// import {log} from '@/app/common/log'

Vue.use(ElementUI);

Vue.prototype.$http = axios
// Vue.prototype.$log = log

Vue.config.productionTip = false

// log.warn('开始挂载 vue')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
