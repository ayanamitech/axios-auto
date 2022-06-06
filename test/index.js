'use strict';

var PromiseAny = require('promise.any');
var axios = require('axios');
var assert = require('assert');
var MockAdapter = require('axios-mock-adapter');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PromiseAny__default = /*#__PURE__*/_interopDefaultLegacy(PromiseAny);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var MockAdapter__default = /*#__PURE__*/_interopDefaultLegacy(MockAdapter);

Promise.any = PromiseAny__default["default"];

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
  const axiosInstance = (_e = config.axios) != null ? _e : axios__default["default"];
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
        config.callback(__spreadProps(__spreadValues({}, response), { error: false, count }));
      }
      if (config.debug === true && response.config) {
        const agent = (_h = response.config.headers) == null ? void 0 : _h["User-Agent"];
        console.log(`Sending ${(_i = response.config.method) == null ? void 0 : _i.toUpperCase()} request to ${response.config.url} using Agent ${agent}`);
      }
      if (typeof config.finishCallback === "function") {
        config.finishCallback(__spreadProps(__spreadValues({}, response), { error: null }));
      }
      return response.data;
    } catch (e) {
      if (((_k = (_j = e.response) == null ? void 0 : _j.config) == null ? void 0 : _k.url) && ((_l = e.response) == null ? void 0 : _l.status)) {
        if (config.debug === true) {
          console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`);
        }
        if (typeof config.callback === "function") {
          config.callback(__spreadProps(__spreadValues({}, e.response), { error: true, count }));
        }
      }
      if (retryMax !== 0) {
        await setDelay(retrySec);
      }
      if (count >= retryMax + 1) {
        if (typeof config.finishCallback === "function") {
          if (e.response) {
            config.finishCallback(__spreadProps(__spreadValues({}, e.response), { error: e }));
          } else {
            config.finishCallback({ config: axiosOptions, error: e });
          }
        }
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

describe("axios-auto", () => {
  it("main", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing axios-auto", date: new Date().toString() };
    mock.onGet("/hello").reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: "/hello", timeout: 100 });
    assert.strict.deepEqual(result, msg);
  });
  it("fail once", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing fail once", date: new Date().toString() };
    const callback = (r) => {
      if (r.count === 1) {
        assert.strict.ok(r.error);
        assert.strict.strictEqual(r.status, 429);
        assert.strict.strictEqual(r.data, "Too Many Requests");
        assert.strict.strictEqual(r.config.timeout, 100);
        assert.strict.strictEqual(r.config.url, "/once");
        assert.strict.strictEqual(r.config.method, "get");
        assert.strict.strictEqual(r.request.responseURL, "/once");
        return;
      }
      if (r.count === 2) {
        assert.strict.ok(r.error === false);
        assert.strict.strictEqual(r.status, 200);
        assert.strict.deepStrictEqual(r.data, msg);
        assert.strict.strictEqual(r.config.timeout, 100);
        assert.strict.strictEqual(r.config.url, "/once");
        assert.strict.strictEqual(r.config.method, "get");
        assert.strict.strictEqual(r.request.responseURL, "/once");
        return;
      }
      assert.strict.fail("Should not retry after success");
    };
    const finishCallback = (r) => {
      assert.strict.strictEqual(r.error, null);
      assert.strict.strictEqual(r.status, 200);
      assert.strict.deepStrictEqual(r.data, msg);
      assert.strict.strictEqual(r.config.timeout, 100);
      assert.strict.strictEqual(r.config.url, "/once");
      assert.strict.strictEqual(r.config.method, "get");
      assert.strict.strictEqual(r.request.responseURL, "/once");
    };
    mock.onGet("/once").replyOnce(429, "Too Many Requests").onGet("/once").reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: "/once", callback, finishCallback, timeout: 100, retrySec: 3, retryMax: 1 });
    assert.strict.deepEqual(result, msg);
  });
  it("fail thrice", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing fail thrice", date: new Date().toString() };
    const callback = (r) => {
      if (r.count < 4) {
        assert.strict.ok(r.error);
        assert.strict.strictEqual(r.status, 429);
        assert.strict.strictEqual(r.data, "Too Many Requests");
        assert.strict.strictEqual(r.config.timeout, 100);
        assert.strict.strictEqual(r.config.url, "/thrice");
        assert.strict.strictEqual(r.config.method, "get");
        assert.strict.strictEqual(r.request.responseURL, "/thrice");
        return;
      }
      if (r.count === 4) {
        assert.strict.ok(r.error === false);
        assert.strict.strictEqual(r.status, 200);
        assert.strict.deepStrictEqual(r.data, msg);
        assert.strict.strictEqual(r.config.timeout, 100);
        assert.strict.strictEqual(r.config.url, "/thrice");
        assert.strict.strictEqual(r.config.method, "get");
        assert.strict.strictEqual(r.request.responseURL, "/thrice");
        return;
      }
      assert.strict.fail("Should not retry after success");
    };
    const finishCallback = (r) => {
      assert.strict.strictEqual(r.error, null);
      assert.strict.strictEqual(r.status, 200);
      assert.strict.deepStrictEqual(r.data, msg);
      assert.strict.strictEqual(r.config.timeout, 100);
      assert.strict.strictEqual(r.config.url, "/thrice");
      assert.strict.strictEqual(r.config.method, "get");
      assert.strict.strictEqual(r.request.responseURL, "/thrice");
    };
    mock.onGet("/thrice").replyOnce(429, "Too Many Requests").onGet("/thrice").replyOnce(429, "Too Many Requests").onGet("/thrice").replyOnce(429, "Too Many Requests").onGet("/thrice").reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: "/thrice", callback, finishCallback, timeout: 100, retrySec: 3, retryMax: 3 });
    assert.strict.deepEqual(result, msg);
  });
  it("fail report", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing fail report", date: new Date().toString() };
    const finishCallback = (r) => {
      assert.strict.ok(r.error instanceof Error);
      assert.strict.strictEqual(r.status, 429);
      assert.strict.deepStrictEqual(r.data, msg);
      assert.strict.strictEqual(r.config.timeout, 100);
      assert.strict.strictEqual(r.config.url, "/fail");
      assert.strict.strictEqual(r.config.method, "get");
      assert.strict.strictEqual(r.request.responseURL, "/fail");
    };
    mock.onGet("/fail").reply(429, msg);
    await assert.strict.rejects(async () => await fetch({ axios: axiosInstance, url: "/fail", finishCallback, timeout: 100, retrySec: 3, retryMax: 0 }), {
      name: /^Error$/,
      message: /Request failed with status code 429/
    });
  });
  it("GET request test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing GET request", date: new Date().toString() };
    mock.onGet("/get").reply(200, msg);
    const result = await get("/get", { axios: axiosInstance, timeout: 0, retryMax: 0 });
    assert.strict.deepEqual(result, msg);
  });
  it("GET request fail test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing GET fail request", date: new Date().toString() };
    mock.onGet("/get").reply(200, msg);
    await assert.strict.rejects(async () => await get("/getFail", { axios: axiosInstance, timeout: 100, retrySec: 3, retryMax: 0 }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
  it("POST request test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance, { onNoMatch: "throwException" });
    const msg = { msg: "Testing POST request", date: new Date().toString() };
    mock.onPost("/post", { id: 1 }).reply(200, msg);
    const result = await post("/post", { id: 1 }, { axios: axiosInstance, timeout: 100, retryMax: 0, retrySec: 3 });
    assert.strict.strictEqual(result.error, void 0);
    assert.strict.deepEqual(result, msg);
  });
  it("POST request fail test", async () => {
    const axiosInstance = axios__default["default"];
    const mock = new MockAdapter__default["default"](axiosInstance);
    const msg = { msg: "Testing POST fail request", date: new Date().toString() };
    mock.onPost("/postFail", { id: 1 }).reply(200, msg);
    await assert.strict.rejects(async () => await post("/postFail", { id: 2 }, { axios: axiosInstance, timeout: 100, retryMax: 0, retrySec: 3 }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
});
