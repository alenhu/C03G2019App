import Vue from 'vue';
import Router from 'vue-router';
import uploadAuth from '../../../components/HelloWorld';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'uploadAuth',
      component: uploadAuth
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = './index.html#/';
    return;
  }
  next();
});
export default router;
