import Vue from 'vue'
import Router from 'vue-router'
import TodosList from '@/components/TodosList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TodosList',
      component: TodosList
    }
  ]
})
