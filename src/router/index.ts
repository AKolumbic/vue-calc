import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import CalculatorView from '../views/CalculatorView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Calculator',
    component: CalculatorView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
