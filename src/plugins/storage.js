import Cookies from "js-cookie";
const psl = require("psl");

export default {
  setItem: (key, value, options = {}) => {
    if (process.client) {
      console.log(process.client);
      const pPsl = psl.parse(document.domain);
      let domain = pPsl.domain;
      if (/\d+\.\d+\.\d+\.\d+/.test(pPsl.input)) domain = pPsl.input;
      options = { domain, ...options };
    }
    Cookies.set(key, value, options);
  },
  getItem: key => {
    return Cookies.get(key);
  },
  removeItem: (key, options = {}) => {
    if (process.client) {
      const pPsl = psl.parse(document.domain);
      let domain = pPsl.domain;
      if (/\d+\.\d+\.\d+\.\d+/.test(pPsl.input)) domain = pPsl.input;
      options = { domain, ...options };
    }
    Cookies.remove(key, options);
  }
};

export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}


export const getStore = name => {
  if (!name) return;
  let v = window.localStorage.getItem(name);
  if (v === null) {
    return "";
  }
  return v;
}
