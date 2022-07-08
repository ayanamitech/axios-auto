import './promise';
import axios, { Method, ResponseType, AxiosStatic, AxiosRequestHeaders, AxiosResponseHeaders, AxiosRequestConfig } from 'axios';
import type { Agent as HTTPAgent } from 'http';
import type { Agent as HTTPSAgent } from 'https';

const isBrowser = typeof window !== 'undefined';

const setDelay = (secs: number): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), secs * 1000));

const getProtocol = (url: string): string => new URL(url).protocol.split(':')[0];

/**
 * AxiosResponseResult object with customized parameters from AxiosResponse to handle errors.
 */
export interface AxiosResponseResult {
  /**
   * Raw data returned by server
   */
  data?: any;
  /**
   * HTTP status code, 200 for most working cases
   */
  status?: number;
  /**
   * HTTP status text, 'OK' for most working cases
   */
  statusText?: string;
  /**
   * HTTP response headers returned by server, should support CORS header by server if it is being used with XHR
   */
  headers?: AxiosResponseHeaders;
  /**
   * AxiosRequestConfig supplied by fetchConfig
   */
  config: AxiosRequestConfig;
  /**
   * Request sent by Axios
   */
  request?: any;
  /**
   * Will return null if promise is resolved, will return Error object when the entire promise is rejected
   */
  error: null | Error;
  /**
   * **count** is the number of HTTP request sent to server
   */
  count: number
}

/**
 * **config.callback** function to retrive debug information while promise is ongoing
 */
export interface callback {
  (message:AxiosResponseResult): void;
}

/**
 * **config.filter** function filters object or Array data to catch custom errors
 */
export interface filter {
  (data:any, count?: number, retryMax?: number): void;
}

/**
 * Common Axios Wrapper config used by fetch function
 */
export interface fetchConfig {
  /**
   * **url** is the server URL that will be used for the request
   */
  url: string;
  /**
   * **method** is the request method to be used when making the request
   */
  method?: Method | string;
  /**
   * **headers** are custom headers to be sent
   */
  headers?: AxiosRequestHeaders;
  /**
   * **data** is the data to be sent as the request body
   * Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
   * When no `transformRequest` is set, must be of one of the following types:
   * - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
   * - Browser only: FormData, File, Blob
   * - Node only: Stream, Buffer
   */
  data?: any;
  /**
   * **timeout** specifies the number of milliseconds before the request times out.
   * If the request takes longer than `timeout`, the request will be aborted.
   * Default is 10000 (10 seconds).
   */
  timeout?: number;
  /**
   * **withCredentials** indicates whether or not cross-site Access-Control requests
   * should be made using credentials
   */
  withCredentials?: boolean;
  /**
   * **responseType** indicates the type of data that the server will respond with
   * options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
   * browser only: 'blob'
   */
  responseType?: ResponseType;

  /**
   * **debug** is boolean value to enable console log
   */
  debug?: boolean;

  /**
   * **retryMax** is the number value to retry against failed requests
   * Default to 5 retries (retryMax = 5)
   */
  retryMax?: number;
  /**
   * **retrySec** is the number value to retry failed requests with this time spacing
   * Note that one Axios request could run for retryMax * retrySec seconds
   */
  retrySec?: number;

  /**
   * Axios instance to provide (Will use Axios installed by peerDeps if not supplied)
   */
  axios?: AxiosStatic;
  /**
   * **callback** is the callback function to debug on going requests while promise is not resolved.
   * Will return AxiosResponseExtended for every requests sent.
   */
  callback?: callback;
  /**
   * **filter** is the callback function to filter response.data for specific case
   * where server returns error inside the object data without HTTP error code.
   */
  filter?: filter;

  /**
   * http.Agent class object, nodejs only https://nodejs.org/api/http.html#class-httpagent
   */
  httpAgent?: HTTPAgent;
  /**
   * https.Agent class object, nodejs only https://nodejs.org/api/https.html#class-httpsagent
   */
  httpsAgent?: HTTPSAgent;

  /**
   * **socks_proxy_agent** is the SocksProxyAgent instance to use, should be supplied if you want to enable socks proxy connection
   * Example: const { SocksProxyAgent } = require('socks-proxy-agent'); config.socks_proxy_agent = SocksProxyAgent;
   */
  socks_proxy_agent?: any;
  /**
   * Setting this option to true will enable socks proxy connection
   */
  socks_enabled?: boolean;
  /**
   * Setting this option to true will enable automatic socket change for Tor when the server returns HTTP error like 429 Too many requests
   */
  socks_isTor?: boolean;
  /**
   * Supply HTTP onion url if the config.url is HTTPS address of the server
   */
  onion_url?: string;
  /**
   * Setting this option to true will enable connecting to onion_url
   */
  socks_onion?: boolean;
  /**
   * Hostname of socks proxy
   */
  socks_host?: string;
  /**
   * Port of socks proxy
   */
  socks_port?: number;
  /**
   * Username of socks proxy
   */
  socks_username?: string;
  /**
   * Password of socks proxy
   */
  socks_password?: string;
}

/**
 * Fetch config used for GET, POST function
 **/
export type getConfig = Omit<fetchConfig, 'url' | 'data'>;

/**
 * Identical with AxiosRequestConfig
 **/
interface AxiosConfig extends Omit<AxiosRequestConfig, 'url' | 'method' | 'headers' | 'timeout' | 'validateStatus' | 'httpAgent' | 'httpsAgent'> {
  url: string;
  method: Method | string;
  headers: AxiosRequestHeaders;
  timeout: number;
  validateStatus: (status: number) => boolean;
  httpAgent?: HTTPAgent;
  httpsAgent?: HTTPSAgent;
}

/**
 * Options for SocksProxyAgent
 **/
interface socksOptions {
  agentOptions: {
    keepAlive: boolean;
  };
  /**
   * Hostname of socks proxy
   */
  hostname?: string;
  /**
   * Port of socks proxy
   */
  port?: number;
  /**
   * Username of socks proxy
   */
  username?: string;
  /**
   * Password of socks proxy
   */
  password?: string;
}

/**
 * HTTP Agent Objects for Node.js
 */
interface AgentOptions {
  /**
   * http.Agent() class object
   */
  httpAgent?: HTTPAgent;
  /**
   * https.Agent() class object
   */
  httpsAgent?: HTTPSAgent;
}

/**
 * Generate socks proxy agent from config
 * @param config Main Config from fetch function
 * @param url URL string from Config
 * @param count Request count to reset circut when using Tor Proxy
 * @returns AgentOptions http.Agent() compatible class object
 **/
function createSocksOptions(config: fetchConfig, url: string, count: number): AgentOptions {
  const SocksProxyAgent = config.socks_proxy_agent;
  const socksOptions: socksOptions = {
    agentOptions: {
      keepAlive: true
    },
    hostname: config.socks_host,
    port: config.socks_port
  };
  const axiosOptions: AgentOptions = {};

  if (!!config.socks_username && !!config.socks_password) {
    socksOptions.username = config.socks_username;
    socksOptions.password = config.socks_password;
  } else if (config.socks_isTor === true) {
    // Retry with different tor circuits https://stackoverflow.com/a/64960234
    socksOptions.username = `circuit${count}`;
  }

  // Handle proxy agent for onion addresses
  if (getProtocol(url) === 'http') {
    axiosOptions.httpAgent = new SocksProxyAgent(socksOptions);
  } else if (getProtocol(url) === 'https') {
    axiosOptions.httpsAgent = new SocksProxyAgent(socksOptions);
  }

  return axiosOptions;
}

/**
  Axios Request Wrapper function that supports automatic retries based on configuration
  @param config FetchConfig Axios Wrapper config
  @returns Promise<any> Data of AxiosResponse
**/
export async function fetch(config: fetchConfig): Promise<any> {
  const axiosOptions: AxiosConfig = {
    url: (config.socks_enabled === true && config.socks_onion === true && !!config.onion_url) ? (config.onion_url || config.url) : config.url,
    method: config.method ?? 'GET',
    timeout: config.timeout ?? (config.socks_enabled ? 30000: 10000),
    validateStatus: (status) => status >= 200 && status < 300,
    headers: config.headers ?? {}
  };
  if (config.responseType) {
    axiosOptions.responseType = config.responseType;
  }
  if (config.data) {
    axiosOptions.data = config.data;
  }
  /**
    Should not apply additional headers for browsers
  **/
  if (isBrowser === false) {
    // User-Agent of Tor Browser
    axiosOptions.headers['User-Agent'] ||= 'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0';
  }
  // Use provided axios instance if available
  const axiosInstance = config.axios ?? axios;
  const retryMax = config.retryMax ?? 5;
  const retrySec = config.retrySec ?? ((config.socks_isTor === true) ? 30 : 5);
  let count = 0;

  while (count < retryMax + 1) {
    count++;
    try {
      /**
        Browsers don't need tor socket support (Node.js only feature)
      **/
      if (isBrowser === false) {
        if (config.socks_enabled === true && config.socks_proxy_agent) {
          const socksOptions = createSocksOptions(config, axiosOptions.url, count);
          // Handle proxy agent for onion addresses
          if (getProtocol(axiosOptions.url) === 'http') {
            axiosOptions.httpAgent = socksOptions.httpAgent;
          } else if (getProtocol(axiosOptions.url) === 'https') {
            axiosOptions.httpsAgent = socksOptions.httpsAgent;
          }
        } else if (config.httpAgent && getProtocol(axiosOptions.url) === 'http') {
          axiosOptions.httpAgent = config.httpAgent;
        } else if (config.httpsAgent && getProtocol(axiosOptions.url) === 'https') {
          axiosOptions.httpsAgent = config.httpsAgent;
        }
      }

      const response = await axiosInstance(axiosOptions);

      if (response.statusText === 'error') {
        throw new Error(`HTTP ${response.statusText} ${response.status} while fetching from ${axiosOptions.url}`);
      }

      if (typeof config.filter === 'function') {
        config.filter(response.data, count, retryMax);
      }

      if (typeof config.callback === 'function') {
        config.callback({ ...response, error: null, count });
      }

      if (config.debug === true && response.config) {
        const agent = response.config.headers?.['User-Agent'];
        console.log(`Sending ${response.config.method?.toUpperCase()} request to ${response.config.url} using Agent ${agent}`);
      }

      return response.data;
    } catch (e: any) {
      if (typeof config.callback === 'function') {
        if (e.response) {
          config.callback({ ...e.response, error: e, count });
        } else {
          config.callback({ config: axiosOptions, error: e, count });
        }
      }
      if (e.response?.config?.url && e.response?.status) {
        if (config.debug === true) {
          console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`);
        }
      }
      // Disable failure delay when retry is disabled with option retryMax: 0
      if (retryMax !== 0) {
        await setDelay(retrySec);
      }
      if (count >= retryMax + 1) {
        throw e;
      }
    }
  }
}

/**
 * Using Promise.any() to implement browser side fault tolerant load balancer that could fetch non-failed results as fast as possible
 * - Promises created from multiple URLs wouldn't resolve until retryMax * retrySec,
 * - if you have supplied a callback function to get results, it will have every results including for those failed ones.
 * - See more about https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any.
 * @param url URL string from Config
 * @param config FetchConfig Axios Wrapper config
 * @param method HTTP request method
 * @param data POST data
 * @returns Promise<any> Promise Data of AxiosResponse
**/
export async function multiFetch(url: string, config?: getConfig, method?: string, data?: any): Promise<any> {
  // Remove any spacing available from url string, and split to array by commas
  const urls = url.replace(/\s+/g, '').split(',');
  // Disable multiFetch when there is no Promise.any defined (Or no promise-any-polyfill);
  if (urls.length !== 1) {
    return Promise.any(urls.map(u => fetch({ url: u, method, data, ...config })));
  }
  return fetch({ url, method, data, ...config });
}

/**
 * Function equivalent with axios.get()
 * @param url URL string from Config
 * @param config FetchConfig Axios Wrapper config
 * @returns Promise<any> Promise Data of AxiosResponse
**/
export function get(url: string, config?: getConfig): Promise<any> {
  return multiFetch(url, config);
}

/**
 * Function equivalent with axios.post()
 * @param url URL string from Config
 * @param data POST data
 * @param config FetchConfig Axios Wrapper config
 * @returns Promise<any> Promise Data of AxiosResponse
**/
export function post(url: string, data: any, config?: getConfig): Promise<any> {
  return multiFetch(url, config, 'post', data);
}

export default {
  fetch,
  multiFetch,
  get,
  post
};
