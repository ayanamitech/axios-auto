'use strict';

var axios = require('axios');
var assert = require('assert');
var MockAdapter = require('axios-mock-adapter');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var MockAdapter__default = /*#__PURE__*/_interopDefaultLegacy(MockAdapter);

var __defProp = Object.defineProperty;
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
const isBrowser = typeof window !== "undefined";
const setDelay = (secs) => new Promise((resolve) => setTimeout(() => resolve(), secs * 1e3));
const getProtocol = (url) => new URL(url).protocol.split(":")[0];
function createSocksOptions(config, url, retry) {
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
    socksOptions.username = `circuit${retry}`;
  }
  if (getProtocol(url) === "http") {
    axiosOptions.httpAgent = new SocksProxyAgent(socksOptions);
  } else if (getProtocol(url) === "https") {
    axiosOptions.httpsAgent = new SocksProxyAgent(socksOptions);
  }
  return axiosOptions;
}
async function fetch(config) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"
  };
  const axiosOptions = {
    url: config.socks_enabled === true && config.socks_onion === true && !!config.onion_url ? config.onion_url || config.url : config.url,
    method: (_a = config.method) != null ? _a : "GET",
    timeout: ((_b = config.timeout) != null ? _b : config.socks_enabled) ? 3e4 : 1e4,
    validateStatus: (status) => status >= 200 && status < 300
  };
  if (config.responseType) {
    axiosOptions.responseType = config.responseType;
  }
  if (config.data) {
    axiosOptions.data = config.data;
  }
  if (isBrowser === false) {
    axiosOptions.headers = (_c = config.headers) != null ? _c : defaultHeaders;
  }
  const axiosInstance = (_d = config.axios) != null ? _d : axios__default["default"];
  const retryMax = (_e = config.retryMax) != null ? _e : 5;
  const retrySec = (_f = config.retrySec) != null ? _f : 60;
  let retry = 0;
  while (retry < retryMax) {
    try {
      if (isBrowser === false) {
        if (config.socks_enabled === true && config.socks_proxy_agent) {
          const socksOptions = createSocksOptions(config, axiosOptions.url, retry);
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
      if (typeof config.callback === "function") {
        config.callback(response);
      }
      if (response.statusText === "error") {
        throw new Error(`HTTP ${response.statusText} ${response.status} while fetching from ${axiosOptions.url}`);
      }
      if (config.debug === true && response.config) {
        const agent = (_g = response.config.headers) == null ? void 0 : _g["User-Agent"];
        console.log(`Sending ${(_h = response.config.method) == null ? void 0 : _h.toUpperCase()} request to ${response.config.url} using Agent ${agent}`);
      }
      return response.data;
    } catch (e) {
      if (((_j = (_i = e.response) == null ? void 0 : _i.config) == null ? void 0 : _j.url) && ((_k = e.response) == null ? void 0 : _k.status)) {
        if (config.debug === true) {
          console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`);
        }
        if (typeof config.callback === "function") {
          config.callback(e.response);
        }
      }
      if (retryMax !== 1) {
        await setDelay(retrySec);
      }
      if (retry === retryMax - 1) {
        throw e;
      }
      retry++;
    }
  }
}
function get(url, config) {
  return fetch(__spreadValues({ url }, config));
}
function post(url, data, config) {
  return fetch(__spreadValues({ url, method: "post", data }, config));
}

describe("axios-auto", () => {
  it("main", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing axios-auto", date: new Date().toString() };
    mock.onGet("/hello").reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: "/hello", timeout: 0 });
    assert.strict.deepEqual(result, msg);
  });
  it("fail once", async () => {
    let count = 0;
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing fail once", date: new Date().toString() };
    const callback = (r) => {
      if (count === 0) {
        assert.strict.equal(r.status, 429);
        assert.strict.equal(r.data, "Too Many Requests");
        assert.strict.equal(r.request.responseURL, "/once");
        count++;
        return;
      }
      if (count === 1) {
        assert.strict.equal(r.status, 200);
        assert.strict.equal(r.request.responseURL, "/once");
        count++;
        return;
      }
      assert.strict.fail("Should not retry after success");
    };
    mock.onGet("/once").replyOnce(429, "Too Many Requests").onGet("/once").reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: "/once", callback, timeout: 0, retrySec: 3 });
    assert.strict.deepEqual(result, msg);
  });
  it("fail thrice", async () => {
    let count = 0;
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing fail thrice", date: new Date().toString() };
    const callback = (r) => {
      if (count < 3) {
        assert.strict.equal(r.status, 429);
        assert.strict.equal(r.data, "Too Many Requests");
        assert.strict.equal(r.request.responseURL, "/thrice");
        count++;
        return;
      }
      if (count === 3) {
        assert.strict.equal(r.status, 200);
        assert.strict.equal(r.request.responseURL, "/thrice");
        count++;
        return;
      }
      assert.strict.fail("Should not retry after success");
    };
    mock.onGet("/thrice").replyOnce(429, "Too Many Requests").onGet("/thrice").replyOnce(429, "Too Many Requests").onGet("/thrice").replyOnce(429, "Too Many Requests").onGet("/thrice").reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: "/thrice", callback, timeout: 0, retrySec: 3 });
    assert.strict.deepEqual(result, msg);
  });
  it("fail report", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing fail report", date: new Date().toString() };
    mock.onGet("/fail").reply(429, msg);
    await assert.strict.rejects(async () => await fetch({ axios: axiosInstance, url: "/fail", timeout: 0, retryMax: 1, retrySec: 3 }), {
      name: /^Error$/,
      message: /Request failed with status code 429/
    });
  });
  it("GET request test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing GET request", date: new Date().toString() };
    mock.onGet("/get").reply(200, msg);
    const result = await get("/get", { axios: axiosInstance, timeout: 0 });
    assert.strict.deepEqual(result, msg);
  });
  it("GET request fail test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing GET fail request", date: new Date().toString() };
    mock.onGet("/get").reply(200, msg);
    await assert.strict.rejects(async () => await get("/getFail", { axios: axiosInstance, timeout: 0, retryMax: 1, retrySec: 3 }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
  it("POST request test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance, { onNoMatch: "throwException" });
    const msg = { msg: "Testing POST request", date: new Date().toString() };
    mock.onPost("/post", { id: 1 }).reply(200, msg);
    const result = await post("/post", { id: 1 }, { axios: axiosInstance, timeout: 0, retryMax: 1, retrySec: 3 });
    assert.strict.equal(result.error, void 0);
    assert.strict.deepEqual(result, msg);
  });
  it("POST request fail test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing POST fail request", date: new Date().toString() };
    mock.onPost("/postFail", { id: 1 }).reply(200, msg);
    await assert.strict.rejects(async () => await post("/postFail", { id: 2 }, { axios: axiosInstance, timeout: 0, retryMax: 1, retrySec: 3 }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
});
