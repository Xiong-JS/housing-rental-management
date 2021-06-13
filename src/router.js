import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HouseInfo = () => import('./views/house/hosueInfo.vue')
const User = () => import('./views/user/user.vue')
const Rental = () => import('./views/house/rental.vue')
const SellList = () => import('./views/house/sellList.vue')
const Carousel = () => import('./views/baseInfo/carousel/Carousel.vue')
const Country = () => import('./views/baseInfo/country/Country.vue')
const Netherlands = () => import('./views/baseInfo/netherlands/Netherlands.vue')
const DetailNetherlands = () => import('./views/baseInfo/dedtailNetherlands/DetailNetherlands.vue')
const Audit = () => import('./views/house/Audit.vue')
const Comment = () => import('./views/baseInfo/comment/Comment.vue')
const Graph = () => import('./views/graph/Graph.vue')


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '',
      redirect: '/user'
    },
    {
      path: '/houseInfo',
      component: HouseInfo,
      meta: {
        hidden: true,
        title: "住房管理"
      },
    },
    {
      path: '/user',
      component: User,
      meta: {
        hidden: true,
        title: "用户管理"
      },
    },
    {
      path: '/rental',
      component: Rental,
      meta: {
        hidden: true,
        title: "住房管理"
      },
    },
    {
      path: '/sellList',
      component: SellList,
      meta: {
        hidden: true,
        title: "住房管理"
      },
    },
    {
      path: '/carousel',
      component: Carousel,
      meta: {
        hidden: true,
        title: "基础管理"
      },
    },
    {
      path: '/country',
      component: Country,
      meta: {
        hidden: true,
        title: "基础管理"
      },
    },
    {
      path: '/netherlands',
      component: Netherlands,
      meta: {
        hidden: true,
        title: "基础管理"
      },
    },
    {
      path: '/detailNetherlands',
      component: DetailNetherlands,
      meta: {
        hidden: true,
        title: "基础管理"
      },
    },
    {
      path: '/audit',
      component: Audit,
      meta: {
        hidden: true,
        title: "住房管理"
      },
    }, {
      path: '/comment',
      component: Comment,
      meta: {
        hidden: true,
        title: "基础管理"
      },
    }, {
      path: '/graph',
      component: Graph,
      meta: {
        hidden: true,
        title: "图表统计"
      },
    }
  ]
})