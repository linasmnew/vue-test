import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CheckListsView from '../views/CheckListsView.vue'
import CheckListView from '../views/CheckListView.vue'
import NewCheckListView from '../views/NewCheckListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/checklists',
      name: 'checklists',
      component: CheckListsView,
    },
    {
      path: '/checklists/:id',
      name: 'checklist',
      component: CheckListView,
    },
    {
      path: '/checklists/new',
      name: 'new-checklist',
      component: NewCheckListView,
    },
  ],
})

export default router
