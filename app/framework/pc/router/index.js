import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '../../../components/HelloWorld';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
});
router.beforeEach((to, from, next) => {
  console.log('beforeEach222222222222');
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = '../mobile/m_index.html#/';
    return;
  }
  next();
});
export default router;
