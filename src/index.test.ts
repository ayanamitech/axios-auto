import { fetch, get, post } from './index';
import { strict as assert } from 'assert';
import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('axios-auto', () => {
  it('main', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing axios-auto', date: new Date().toString() };
    mock.onGet('/hello').reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: '/hello', timeout: 0 });
    assert.deepEqual(result, msg);
  });
  it('fail once', async () => {
    let count = 0;
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing fail once', date: new Date().toString() };
    const callback = (r: AxiosResponse) => {
      if (count === 0) {
        assert.strictEqual(r.status, 429);
        assert.strictEqual(r.data, 'Too Many Requests');
        assert.strictEqual(r.request.responseURL, '/once');
        count++;
        return;
      }
      if (count === 1) {
        assert.strictEqual(r.status, 200);
        assert.strictEqual(r.request.responseURL, '/once');
        count++;
        return;
      }
      assert.fail('Should not retry after success');
    };
    mock
      .onGet('/once')
      .replyOnce(429, 'Too Many Requests')
      .onGet('/once')
      .reply(200, msg);
    const result = await fetch({ axios: axiosInstance, url: '/once', callback, timeout: 0, retrySec: 3 });
    assert.deepEqual(result, msg);
  });
  it('fail thrice', async () => {
    let count = 0;
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing fail thrice', date: new Date().toString() };
    const callback = (r: AxiosResponse) => {
      if (count < 3) {
        assert.strictEqual(r.status, 429);
        assert.strictEqual(r.data, 'Too Many Requests');
        assert.strictEqual(r.request.responseURL, '/thrice');
        count++;
        return;
      }
      if (count === 3) {
        assert.strictEqual(r.status, 200);
        assert.strictEqual(r.request.responseURL, '/thrice');
        count++;
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
    const result = await fetch({ axios: axiosInstance, url: '/thrice', callback, timeout: 0, retrySec: 3 });
    assert.deepEqual(result, msg);
  });
  it('fail report', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing fail report', date: new Date().toString() };
    mock
      .onGet('/fail')
      .reply(429, msg);
    await assert.rejects(async () => await fetch({ axios: axiosInstance, url: '/fail', timeout: 0, retryMax: 1, retrySec: 3 }), {
      name: /^Error$/,
      message: /Request failed with status code 429/
    });
  });
  it('GET request test', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing GET request', date: new Date().toString() };
    mock.onGet('/get').reply(200, msg);
    const result = await get('/get', { axios: axiosInstance, timeout: 0 });
    assert.deepEqual(result, msg);
  });
  it('GET request fail test', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing GET fail request', date: new Date().toString() };
    mock.onGet('/get').reply(200, msg);
    await assert.rejects(async () => await get('/getFail', { axios: axiosInstance, timeout: 0, retryMax: 1, retrySec: 3  }), {
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
    const result = await post('/post', { id: 1 }, { axios: axiosInstance, timeout: 0, retryMax: 1, retrySec: 3 });
    assert.strictEqual(result.error, undefined);
    assert.deepEqual(result, msg);
  });
  it('POST request fail test', async () => {
    const axiosInstance = axios;
    const mock = new MockAdapter(axiosInstance);
    const msg = { msg: 'Testing POST fail request', date: new Date().toString() };
    mock.onPost('/postFail', { id: 1 }).reply(200, msg);
    await assert.rejects(async () => await post('/postFail', { id: 2 }, { axios: axiosInstance, timeout: 0, retryMax: 1, retrySec: 3  }), {
      name: /^Error$/,
      message: /Request failed with status code 404/
    });
  });
});
