import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局图标样式库
import "./assets/font/iconfont.css"

//导入全局样式表
import "./assets/css/common.css"

Vue.config.productionTip = false,

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
