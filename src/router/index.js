import Vue from 'vue';
import Router from 'vue-router';
import BaseTransition from '../BaseTransition';
import loading from '../components/loading/loading';
import Index from '../view/Index';

Vue.use(Router);

Router.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1);
};

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'BaseTransition',
      component: BaseTransition,
      children: [
        {
          path: '',
          name: 'Index',
          component: Index
        },
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  loading.show();
  next();
});

router.afterEach(route => {
  loading.hide();
});

export default router;