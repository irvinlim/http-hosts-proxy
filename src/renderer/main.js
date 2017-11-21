import App from './App';
import Toasted from 'vue-toasted';
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import router from './router';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

// Add Vue plugins here.
Vue.use(Toasted);
Vue.use(VeeValidate);

// Add custom Validators here.
VeeValidate.Validator.extend('valid_hostname', {
  getMessage() {
    return 'The hostname is invalid.';
  },

  validate(value) {
    const hostnameRegex = /(?=^.{1,254}$)(^(?:[a-zA-Z0-9_\\-]{1,63}\.?)+(?:[a-zA-Z]{2,})$)/;
    return hostnameRegex.test(value);
  },
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>',
}).$mount('#app');
