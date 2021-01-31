import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HouseInfo = () => import('./components/house/hosueInfo.vue')
const User = () => import('./components/user//user.vue')
const Rental = () => import('./components/house/rental.vue')
const SellList = () => import('./components/house/sellList.vue')
const Carousel = ()=>import('./views/carousel/Carousel.vue')


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '',
      redirect: '/user'
    },
    {
      path: '/houseInfo',
      component: HouseInfo
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/rental',
      component: Rental
    },
    {
      path: '/sellList',
      component: SellList
    },
    {
      path:'/carousel',
      component:Carousel
    }
  ]
})