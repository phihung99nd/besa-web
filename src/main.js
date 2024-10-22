import Vue from "vue";
import App from "./App";
import router from "./router";
import ViewUI from "view-design";
import iViewPro from "./libs/iview-pro/iview-pro.min";
import VueMask from 'v-mask';
import VueViewer from 'v-viewer'
import VModal from 'vue-js-modal'
import VueLazyload from 'vue-lazyload'
import Notifications from 'vue-notification'
import DropdownMenu from "v-dropdown-menu/vue2"
import VueCookies from 'vue-cookies-reactive'
import vClickOutside from 'v-click-outside'
import BonoComponent from "bono-component";
import './assets/styles/multiselect.scss';
import "./assets/styles/bootstrap-grid.min.css"
import "./assets/styles/bootstrap-utilities.min.css"
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'swiper/dist/css/swiper.css'
import './libs/iview-pro/iview-pro.css'
import 'viewerjs/dist/viewer.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "./assets/styles/theme.less";
import "./assets/styles/global.scss";
// import "v-dropdown-menu/dist/vue2/v-dropdown-menu.css"
import * as filters from "./plugins/filters";
import store from "@/vuex/store";
import storage from "@/plugins/storage";
import {InstallAll} from "@/components/global.js";
import i18n from "@/locale";
import minio from "@/mixins/minio";
import Storage from "./plugins/storage";
import {refresh} from "./plugins/request";

const {title} = require("@/config");
Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value),
  transfer: true
});

Vue.use(InstallAll);
Vue.use(VueMask);
Vue.use(VueViewer)
// Vue.use(DropdownMenu);
Vue.component('v-dropdown', DropdownMenu)
Vue.use(iViewPro)
Vue.use(VModal, {
  dynamicDefaults: {
    draggable: false,
    resizable: false,
    height: 'auto'
  },
  componentName: 'v-modal'
})
Vue.use(VueCookies)
Vue.use(Notifications, {name: 'notify', componentName: 'v-notify'})
const loadimage = require("@/assets/images/logo/logo-loading.png")
const errorimage = require("@/assets/images/error-image-generic.png")
Vue.use(VueLazyload, {
  silent: false,
  error: errorimage,
  loading: loadimage,
  attempt: 10,
  throttleWait: 0,
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
})
Vue.use(vClickOutside)
Vue.use(BonoComponent, {
  i18n: (key, value) => i18n.t(key, value),
});
Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

router.beforeEach(async (to, from, next) => {
  ViewUI.LoadingBar.start();
  window.document.title = to && to.meta && to.meta.title ? to.meta.title : title
  let accessToken = Storage.getItem('buyer_accessToken');
  let refreshToken = Storage.getItem('buyer_refreshToken');
  if (!accessToken && refreshToken) {
    await refresh()
    next()
  } else next()
});

router.afterEach((route) => {
  ViewUI.LoadingBar.finish();
});

Vue.prototype.linkTo = function (url) {
  if (url.substr(0, 1) === "/") {
    if (router.mode === "hash") {
      window.open(location.origin + "/#" + url, "_self");
    } else {
      window.open(location.origin + url, "_self");
    }
  } else {
    window.open(url, "_self");
  }
};
Vue.mixin(minio)
Vue.prototype.Cookies = storage;
/* eslint-disable no-new */
new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App),
});
