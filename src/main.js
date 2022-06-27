import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 引入手势插件
import VueTouch from 'vue-touch';

Vue.config.productionTip = false;
// 注册到Vue
Vue.use(VueTouch);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
