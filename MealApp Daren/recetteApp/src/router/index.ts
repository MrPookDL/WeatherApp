import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw, useRoute } from 'vue-router';
// import Accueil from '../views/Accueil.vue'
// import Detail from '../views/Detail.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'accueil'
  },
  {
    path: '/accueil',
    name: 'Recette du jour',
    component: () => import ('../views/Template.vue')
  },
  {
    path: '/detail/:idMeal',
    name: 'detail',
    component: () => import ('../views/Template.vue')
  },
  {
    path: '/liste/:id',
    name: 'Liste',
    component: import ('../views/Liste.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
