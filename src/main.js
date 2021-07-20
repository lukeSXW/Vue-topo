import Vue from 'vue'
import App from './App.vue'
import router from './router'
import topology from "topology-vue";
import Antd from 'ant-design-vue';
import "topology-vue/topology-vue.css";
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false
Vue.use(topology);
Vue.use(Antd);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
