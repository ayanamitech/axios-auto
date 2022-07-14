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
'use strict';

var PromiseAny = require('promise.any');
require('abortcontroller-polyfill/dist/abortcontroller-polyfill-only.js');
var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PromiseAny__default = /*#__PURE__*/_interopDefaultLegacy(PromiseAny);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

Promise.any = PromiseAny__default["default"];

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
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
async function fetch(config, signal) {
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
  let abort = false;
  if (signal) {
    axiosOptions.signal = signal;
    signal.addEventListener("abort", () => {
      abort = true;
    });
  }
  if (isBrowser === false) {
    (_d = axiosOptions.headers)["User-Agent"] || (_d["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0");
  }
  const axiosInstance = (_e = config.axios) != null ? _e : axios__default["default"];
  const retryMax = (_f = config.retryMax) != null ? _f : 5;
  const retrySec = (_g = config.retrySec) != null ? _g : config.socks_isTor === true ? 30 : 5;
  let count = 0;
  while (count < retryMax + 1) {
    if (abort) {
      throw new Error("This operation was aborted.");
    }
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
      if (typeof config.filter === "function") {
        config.filter(response.data, count, retryMax);
      }
      if (typeof config.callback === "function") {
        config.callback({ ...response, error: null, count });
      }
      if (config.debug === true && response.config) {
        const agent = (_h = response.config.headers) == null ? void 0 : _h["User-Agent"];
        console.log(`Sending ${(_i = response.config.method) == null ? void 0 : _i.toUpperCase()} request to ${response.config.url} using Agent ${agent}`);
      }
      return response.data;
    } catch (e) {
      if (signal && signal.aborted) {
        throw e;
      }
      if (typeof config.callback === "function") {
        if (e.response) {
          config.callback({ ...e.response, error: e, count });
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
    let count = urls.length;
    let success = false;
    const abortController = new AbortController();
    if (typeof window === "undefined" && typeof process !== "undefined" && process.release.name === "node") {
      const { default: events } = await Promise.resolve().then(() => __toESM(require("events")));
      events.setMaxListeners(30 + urls.length, abortController.signal);
    }
    return Promise.any(urls.map(async (u) => {
      try {
        const result = await fetch({ url: u, method, data, ...config }, abortController.signal);
        count--;
        success = true;
        abortController.abort();
        return result;
      } catch (e) {
        count--;
        if (success === false) {
          throw e;
        }
      }
    }));
  } else {
    return fetch({ url, method, data, ...config });
  }
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

exports["default"] = index;
exports.fetch = fetch;
exports.get = get;
exports.multiFetch = multiFetch;
exports.post = post;
