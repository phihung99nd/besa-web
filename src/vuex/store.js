import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import storage from '@/plugins/storage.js'
import VuexPersistence from 'vuex-persist';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navList: [],
    cartNum: storage.getItem('cartNum') || 0,
    logoImg: storage.getItem('logoImg') || require('@/assets/images/logo/logo-text.png'),
    logoImgDark: storage.getItem('logoImgDark') || require('@/assets/images/logo/logo-text.png'),
    siteName:storage.getItem('siteName') || 'Besa - Booking Now',
    hotWordsList: [],
    category: JSON.parse(localStorage.getItem('category')),
    currentLocation: JSON.parse(localStorage.getItem('vuex.currentLocation')) || '',
    mapAccessToken: 'pk.eyJ1IjoicGhpaHVuZzk5bmQiLCJhIjoiY2xrZ2J3dngzMHRpYzNycXM2eXJwZWRldSJ9.3MJ7a9ozL-Z4UvtxC-3Qcw',
    mapStyle: 'mapbox://styles/phihung99nd/clkgk6k09002x01pn5irnfs4m',
    unseenMessageCount: 0,
    notificationList: [],
    favoriteServiceList: [],
    favoriteStoreList: [],
    historySearchList: [],
  },
  getters,
  actions,
  mutations,
  plugins: [
    new VuexPersistence({
      reducer: (state) => ({
        ...state
      }),
      storage: window.localStorage,
    }).plugin,
  ],
});
