import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from 'bootstrap-vue';
import ToggleSwitch from 'vuejs-toggle-switch'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/toggles-full.css';
import '@/css/toggles.css'

Vue.use(BootstrapVue)
Vue.use(ToggleSwitch)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
