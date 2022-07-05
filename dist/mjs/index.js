/*!
 * MIT License
 * 
 * Copyright (c) 2014-present Matt Zabriskie & Axios Collaborators
 * Copyright (c) 2022 AyanamiTech
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
import PromiseAny from 'promise.any';
import axios from 'axios';

Promise.any = PromiseAny;

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const isBrowser = typeof window !== "undefined";
const setDelay = (secs) => new Promise((resolve) => setTimeout(() => resolve(), secs * 1e3));
const getProtocol = (url) => new URL(url).protocol.split(":")[0];
function createSocksOptions(config, url, count) {
  const SocksProxyAgent = config.socks_proxy_agent;
  const socksOptions = {
    agentOptions: {
      keepAlive: true
    },
    hostname: config.socks_host,
    port: config.socks_port
  };
  const axiosOptions = {};
  if (!!config.socks_username && !!config.socks_password) {
    socksOptions.username = config.socks_username;
    socksOptions.password = config.socks_password;
  } else if (config.socks_isTor === true) {
    socksOptions.username = `circuit${count}`;
  }
  if (getProtocol(url) === "http") {
    axiosOptions.httpAgent = new SocksProxyAgent(socksOptions);
  } else if (getProtocol(url) === "https") {
    axiosOptions.httpsAgent = new SocksProxyAgent(socksOptions);
  }
  return axiosOptions;
}
async function fetch(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const axiosOptions = {
    url: config.socks_enabled === true && config.socks_onion === true && !!config.onion_url ? config.onion_url || config.url : config.url,
    method: (_a = config.method) != null ? _a : "GET",
    timeout: (_b = config.timeout) != null ? _b : config.socks_enabled ? 3e4 : 1e4,
    validateStatus: (status) => status >= 200 && status < 300,
    headers: (_c = config.headers) != null ? _c : {}
  };
  if (config.responseType) {
    axiosOptions.responseType = config.responseType;
  }
  if (config.data) {
    axiosOptions.data = config.data;
  }
  if (isBrowser === false) {
    (_d = axiosOptions.headers)["User-Agent"] || (_d["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0");
  }
  const axiosInstance = (_e = config.axios) != null ? _e : axios;
  const retryMax = (_f = config.retryMax) != null ? _f : 5;
  const retrySec = (_g = config.retrySec) != null ? _g : config.socks_isTor === true ? 30 : 5;
  let count = 0;
  while (count < retryMax + 1) {
    count++;
    try {
      if (isBrowser === false) {
        if (config.socks_enabled === true && config.socks_proxy_agent) {
          const socksOptions = createSocksOptions(config, axiosOptions.url, count);
          if (getProtocol(axiosOptions.url) === "http") {
            axiosOptions.httpAgent = socksOptions.httpAgent;
          } else if (getProtocol(axiosOptions.url) === "https") {
            axiosOptions.httpsAgent = socksOptions.httpsAgent;
          }
        } else if (config.httpAgent && getProtocol(axiosOptions.url) === "http") {
          axiosOptions.httpAgent = config.httpAgent;
        } else if (config.httpsAgent && getProtocol(axiosOptions.url) === "https") {
          axiosOptions.httpsAgent = config.httpsAgent;
        }
      }
      const response = await axiosInstance(axiosOptions);
      if (response.statusText === "error") {
        throw new Error(`HTTP ${response.statusText} ${response.status} while fetching from ${axiosOptions.url}`);
      }
      if (typeof config.callback === "function") {
        config.callback(__spreadProps(__spreadValues({}, response), { error: null, count }));
      }
      if (config.debug === true && response.config) {
        const agent = (_h = response.config.headers) == null ? void 0 : _h["User-Agent"];
        console.log(`Sending ${(_i = response.config.method) == null ? void 0 : _i.toUpperCase()} request to ${response.config.url} using Agent ${agent}`);
      }
      return response.data;
    } catch (e) {
      if (typeof config.callback === "function") {
        if (e.response) {
          config.callback(__spreadProps(__spreadValues({}, e.response), { error: e, count }));
        } else {
          config.callback({ config: axiosOptions, error: e, count });
        }
      }
      if (((_k = (_j = e.response) == null ? void 0 : _j.config) == null ? void 0 : _k.url) && ((_l = e.response) == null ? void 0 : _l.status)) {
        if (config.debug === true) {
          console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`);
        }
      }
      if (retryMax !== 0) {
        await setDelay(retrySec);
      }
      if (count >= retryMax + 1) {
        throw e;
      }
    }
  }
}
async function multiFetch(url, config, method, data) {
  const urls = url.replace(/\s+/g, "").split(",");
  if (urls.length !== 1) {
    return Promise.any(urls.map((u) => fetch(__spreadValues({ url: u, method, data }, config))));
  }
  return fetch(__spreadValues({ url, method, data }, config));
}
function get(url, config) {
  return multiFetch(url, config);
}
function post(url, data, config) {
  return multiFetch(url, config, "post", data);
}
var index = {
  fetch,
  multiFetch,
  get,
  post
};

export { index as default, fetch, get, multiFetch, post };
