import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

//导入全局图标样式库
import "./assets/font/iconfont.css"

//导入全局样式表
import "./assets/css/common.css"


axios.defaults.baseURL="http://192.168.0.195:8081";
axios.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
axios.defaults.transformRequest=[function (data) {
  // Do whatever you want to transform the data
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}]

Vue.prototype.$http=axios;
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
