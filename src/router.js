import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HouseInfo = () => import('./views/house/hosueInfo.vue')
const User = () => import('./views/user/user.vue')
const Rental = () => import('./views/house/rental.vue')
const SellList = () => import('./views/house/sellList.vue')
const Carousel = ()=>import('./views/baseInfo/carousel/Carousel.vue')
const Country = ()=>import('./views/baseInfo/country/Country.vue')
const Netherlands = ()=>import('./views/baseInfo/netherlands/Netherlands.vue')
const DetailNetherlands = ()=>import('./views/baseInfo/dedtailNetherlands/DetailNetherlands.vue')


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
    },
    {
      path:'/country',
      component:Country
    },
    {
      path:'/netherlands',
      component:Netherlands
    },
    {
      path:'/detailNetherlands',
      component:DetailNetherlands
    }
  ]
})