export default {
  '/': {
    name: 'homepage',
    meta: {
      title: '首页'
    },
    component: () => import('./pc/user/login')
  },
  '/sub': {
    name: 'subpage',
    meta: {
      title: '第二页'
    },
    component: () => import('./components/HelloWorld')
  }
};
