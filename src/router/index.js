import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/User.vue'
import Rights from '../components/power/Right.vue'
Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home,redirect:'/welcome',
    children:[
        {path:'/welcome',component:Welcome},
        {path:"/users",component:Users},
        {path:"/rights",component:Rights}
    ]
  }
]

const router = new VueRouter({
  routes
})
//路由导航守卫来控制访问权限
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  const myToken=window.sessionStorage.getItem('token');
  if(!myToken) return next('/login');
  next();
})
export default router
