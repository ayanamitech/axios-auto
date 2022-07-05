import { fetch, get, post, AxiosResponseResult } from './index';
import { strict as assert } from 'assert';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('axios-auto', () => {
  it('main', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing axios-auto', date: new Date().toString() };
    mock.onGet('/hello').reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: '/hello', timeout: 100 });
    assert.deepEqual(result, msg);
  });
  it('fail once', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing fail once', date: new Date().toString() };
    const callback = (r: AxiosResponseResult) => {
      if (r.count === 1) {
        assert.ok(r.error instanceof Error);
        assert.strictEqual(r.status, 429);
        assert.strictEqual(r.data, 'Too Many Requests');
        assert.strictEqual(r.config.timeout, 100);
        assert.strictEqual(r.config.url, '/once');
        assert.strictEqual(r.config.method, 'get');
        assert.strictEqual(r.request.responseURL, '/once');
        return;
      }
      if (r.count === 2) {
        assert.ok(r.error === null);
        assert.strictEqual(r.status, 200);
        assert.deepStrictEqual(r.data, msg);
        assert.strictEqual(r.config.timeout, 100);
        assert.strictEqual(r.config.url, '/once');
        assert.strictEqual(r.config.method, 'get');
        assert.strictEqual(r.request.responseURL, '/once');
        return;
      }
      assert.fail('Should not retry after success');
    };
    mock
      .onGet('/once')
      .replyOnce(429, 'Too Many Requests')
      .onGet('/once')
      .reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: '/once', callback, timeout: 100, retrySec: 3, retryMax: 1 });
    assert.deepEqual(result, msg);
  });
  it('fail thrice', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing fail thrice', date: new Date().toString() };
    const callback = (r: AxiosResponseResult) => {
      if (r.count < 4) {
        assert.ok(r.error instanceof Error);
        assert.strictEqual(r.status, 429);
        assert.strictEqual(r.data, 'Too Many Requests');
        assert.strictEqual(r.config.timeout, 100);
        assert.strictEqual(r.config.url, '/thrice');
        assert.strictEqual(r.config.method, 'get');
        assert.strictEqual(r.request.responseURL, '/thrice');
        return;
      }
      if (r.count === 4) {
        assert.ok(r.error === null);
        assert.strictEqual(r.status, 200);
        assert.deepStrictEqual(r.data, msg);
        assert.strictEqual(r.config.timeout, 100);
        assert.strictEqual(r.config.url, '/thrice');
        assert.strictEqual(r.config.method, 'get');
        assert.strictEqual(r.request.responseURL, '/thrice');
        return;
      }
      assert.fail('Should not retry after success');
    };
    mock
      .onGet('/thrice')
      .replyOnce(429, 'Too Many Requests')
      .onGet('/thrice')
      .replyOnce(429, 'Too Many Requests')
      .onGet('/thrice')
      .replyOnce(429, 'Too Many Requests')
      .onGet('/thrice')
      .reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: '/thrice', callback, timeout: 100, retrySec: 3, retryMax: 3 });
    assert.deepEqual(result, msg);
  });
  it('fail report', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing fail report', date: new Date().toString() };
    const callback = (r: AxiosResponseResult) => {
      assert.ok(r.error instanceof Error);
      assert.strictEqual(r.status, 429);
      assert.deepStrictEqual(r.data, msg);
      assert.strictEqual(r.config.timeout, 100);
      assert.strictEqual(r.config.url, '/fail');
      assert.strictEqual(r.config.method, 'get');
      assert.strictEqual(r.request.responseURL, '/fail');
    };
    mock
      .onGet('/fail')
      .reply(429, msg);
    await assert.rejects(async () => await fetch({ axios: axiosInstance, url: '/fail', callback, timeout: 100, retrySec: 3, retryMax: 0 }), {
      name: /^Error$/,
      message: /Request failed with status code 429/
    });
  });
  it('GET request test', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing GET request', date: new Date().toString() };
    mock.onGet('/get').reply(200, msg);
    const result = await get('/get', { axios: axiosInstance, timeout: 0, retryMax: 0 });
    assert.deepEqual(result, msg);
  });
  it('GET request fail test', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing GET fail request', date: new Date().toString() };
    mock.onGet('/get').reply(200, msg);
    await assert.rejects(async () => await get('/getFail', { axios: axiosInstance, timeout: 100, retrySec: 3, retryMax: 0  }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
  it('POST request test', async () => {
    const axiosInstance = axios;
    // { onNoMatch: "throwException" } to return new Error object from mock, not the 404 error
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });
    const msg = { msg: 'Testing POST request', date: new Date().toString() };
    mock.onPost('/post', { id: 1 }).reply(200, msg);
    const result = await post('/post', { id: 1 }, { axios: axiosInstance, timeout: 100, retryMax: 0, retrySec: 3 });
    assert.strictEqual(result.error, undefined);
    assert.deepEqual(result, msg);
  });
  it('POST request fail test', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing POST fail request', date: new Date().toString() };
    mock.onPost('/postFail', { id: 1 }).reply(200, msg);
    await assert.rejects(async () => await post('/postFail', { id: 2 }, { axios: axiosInstance, timeout: 100, retryMax: 0, retrySec: 3  }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
});
