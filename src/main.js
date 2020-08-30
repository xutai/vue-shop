import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import axios from 'axios';

Vue.config.productionTip = false;
//配置了请求基准路径
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/";
//请求拦截器    //API V1 认证统一使用 Token 认证
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http=axios;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
