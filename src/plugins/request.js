import axios from 'axios';
import https from 'https';
import {Message, Spin, Modal} from 'view-design';
import Storage, {getStore, setStore} from './storage';
import router from '../router/index.js';
import store from '../vuex/store';
import {handleRefreshToken} from '../api/index';
import {v4 as uuidv4} from 'uuid';
import i18n from "@/locale";
import config from "../config/index"
import Vue from "vue";

const qs = require('qs');

export const buyerUrl = process.env.VUE_APP_BASE_URL || config.baseUrl
export const commonUrl = process.env.VUE_APP_COMMON_URL || config.commonUrl
const service = axios.create({
  timeout: 10000, // 请求超时时间
  baseURL: buyerUrl + '/buyer', // API
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': Vue.config.lang == 'vi-VN' ? 'vi' : 'en'
  },
  paramsSerializer: params =>
    qs.stringify(params, {
      arrayFormat: 'repeat'
    })
});

service.interceptors.request.use(
  config => {
    const {loading} = config;
    const isPutPost = config.method === 'put' || config.method === 'post';
    const isJson = config.headers['Content-Type'] === 'application/json';
    const isFile = config.headers['Content-Type'] === 'multipart/form-data';
    if (config.method == "get" && config.params) {
      // Remove empty value query
      Object.keys(config.params).forEach(key => {
        if (["", null, undefined].includes(config.params[key])) {
          delete config.params[key];
        }
      });
      config.params = {
        ...config.params
      };
    }
    if (isPutPost && config.url == '/oauth2/token') {
      let oldPass = config.data.get('password')
      config.data.set('password', hashPass(oldPass))
    }
    if (isPutPost && isJson) {
      config.data = JSON.stringify(config.data);
    }
    if (isPutPost && !isFile && !isJson) {
      config.data = qs.stringify(config.data, {
        arrayFormat: 'repeat'
      });
    }

    if (process.client && loading !== false) {
      config.loading = Spin.show();
    }

    let uuid = getStore("uuid");
    if (!uuid) {
      uuid = uuidv4();
      setStore('uuid', uuid);
    }
    config.headers['uuid'] = uuid;

    let accessToken = Storage.getItem('buyer_accessToken');
    if (accessToken && config.needToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  async response => {
    await closeLoading(response);

    return response.data;
  },
  async error => {
    if (process.server) return Promise.reject(error);
    await closeLoading(error);
    const errorResponse = error.response || {};
    const errorData = errorResponse.data || {};
    const originalConfig = error.response.config;

    if ((errorResponse.status === 401 || errorResponse.status == 403) && !originalConfig._retry && !(originalConfig.params && originalConfig.params.grant_type == 'refresh_token')) {
      originalConfig._retry = true;
      try {
        await refresh(error, originalConfig._retry)
      } catch (_err) {
        return Promise.reject(_err);
      }
    // } else if (errorResponse.status === 400) {
    //   Message.error({content: errorData.message || 'Bad request', duration: 5})
      // } else if (errorResponse.status === 404) {
      //   Message.error({content: errorData.message || 'Not Found', duration: 5})
      // } else if (errorResponse.status == 403) {
      //   Message.error({content: errorData.message || 'Forbidden action', duration: 5})
      // } else if (errorResponse.status == 500) {
      //   Message.error({content: errorData.message || 'Unexpected error', duration: 5})
    }
    return Promise.reject(error);
  }
)

export async function refresh(error, retry) {
  try {
  const getTokenRes = await getTokenDebounce();
    if (getTokenRes) {
      if (retry) {
        error.response.config.headers.accessToken = Storage.getItem(
          'buyer_accessToken'
        );
        return service(error.response.config);
      }
    } else {
      Storage.removeItem('buyer_accessToken');
      Storage.removeItem('buyer_refreshToken');
      Storage.removeItem('buyer_userInfo');
      Storage.setItem('cartNum', 0);
      store.commit('SET_CARTNUM', 0);
      if (router.currentRoute.name == 'login') return
      router.push({
        path: '/login',
        query: {
          rePath: router.history.current.path,
          query: JSON.stringify(router.history.current.query)
        }
      });
      // Modal.confirm({
      //   title: i18n.t('Please sign in'),
      //   content: i18n.t('Session timed out. Please log in again'),
      //   okText: i18n.t('Sign in'),
      //   cancelText: i18n.t('Back'),
      //   onOk: () => {
      //     router.push({
      //       path: '/login',
      //       query: {
      //         rePath: router.history.current.path,
      //         query: JSON.stringify(router.history.current.query)
      //       }
      //     });
      //   },
      //   onCancel: () => {
      //     Modal.remove();
      //   }
      // });
    }
  } catch (e) {
    console.log(e)
  }
}

function hashPass(oldPass) {
  return oldPass
}

/**
 * 关闭全局加载
 * @param target
 */
const closeLoading = target => {
  if (!target.config || !target.config.loading) return true;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      target.config.loading.hide();
      resolve();
    }, 200);
  });
};

export const Method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};

export default function request(options) {
  return service(options);
}

async function getTokenDebounce() {
  let result = false
  let oldRefreshToken = Storage.getItem('buyer_refreshToken');
  if (oldRefreshToken) {
    let res
    try{
    res = await handleRefreshToken(oldRefreshToken)
    } catch (e) {
      return false
    }
    if (res.refresh_token) {
      let {access_token, refresh_token, expires_in} = res;
      let expires
      const exp = new Date().valueOf() / 1000
      let newExp = exp + expires_in
      expires = getExpiresTime(newExp);
      result = true
      Storage.setItem('buyer_accessToken', access_token, {expires});
      Storage.setItem('buyer_refreshToken', refresh_token, {expires: getExpiresTime(2147483647)});
    }
  }
  return result
}

export function getExpiresTime(expiresTime) {
  let nowTimeNum = Math.round(new Date() / 1000);
  let expiresTimeNum = expiresTime - nowTimeNum;
  return parseFloat(parseFloat(parseFloat(expiresTimeNum / 60) / 60) / 24);
}
