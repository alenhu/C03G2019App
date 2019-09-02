import Vue from 'vue';
import VueRouter from 'vue-router';
import vueOptionEvents from 'vue-option-events';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {
  map,
  assign
} from 'lodash';
import routes from './route';
import App from './app';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(vueOptionEvents);
Vue.use(Element);

const router = new VueRouter({
  routes: map(routes, (route, path) => assign({ path }, route))
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h('app')
});
