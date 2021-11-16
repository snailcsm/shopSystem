import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from "../views/home/Home";
import Welcome from "../views/home/Welcome";
import User from "../views/user/User";
import Roles from "../views/rights/Roles";
import Rights from "../views/rights/Rights";

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    name:"登录",
    path:"/login",
    component:Login
  },
  {
    name:"首页",
    path:"/home",
    component:Home,
    redirect: "/welcome",
    children:[
      {
      name:'',
        path:'/welcome',
        component:Welcome
    },
      {
        name:'用户列表',
        path:'/user',
        component:User
      },
      {
        name:'角色列表',
        path:'/roles',
        component:Roles
      },
      {
        name:'权限列表',
        path:'/rights',
        component:Rights
      }
      ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path==="/login") return next();//如果是去登录页，直接放行
  const token=window.sessionStorage.getItem('token');
  if(!token) return next('/login');//如果token为空，跳转去登录页
  next();
})

export default router
