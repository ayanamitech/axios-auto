import axios, { Method, ResponseType, AxiosResponse, AxiosStatic, AxiosRequestHeaders } from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { serializeError } from 'serialize-error-browser';

const isBrowser = typeof window !== 'undefined';

const setDelay = (secs: number): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), secs * 1000));

const getProtocol = (url: string): string => new URL(url).protocol.split(':')[0];

export interface callback {
  (message:AxiosResponse): void;
}

/**
  From https://github.com/axios/axios/blob/a02fe284dfa9161a548b5c079c43ee0f9dfba053/index.d.ts#L127
**/
export interface getConfig {
  method?: Method | string;
  headers?: AxiosRequestHeaders;
  timeout?: number;
  responseType?: ResponseType;

  // Retry settings
  retryMax?: number;
  retrySec?: number;

  // Axios instance
  axios?: AxiosStatic;
  // Optional callback function to retrive connection status
  callback?: callback;

  // SocksProxy related
  onion_url?: string;
  socks_enabled?: boolean;
  socks_onion?: boolean;
  socks_host?: string;
  socks_port?: number;
  socks_username?: string;
  socks_password?: string;
}

export interface fetchConfig extends getConfig {
  url: string;
  data?: any;
}

export interface axiosOptions {
  url: string;
  method: Method | string;
  headers?: AxiosRequestHeaders;
  data?: any;
  timeout: number;
  responseType?: ResponseType;
  httpAgent?: any;
  httpsAgent?: any;
}

export interface socksOptions {
  agentOptions: {
    keepAlive: boolean;
  };
  hostname?: string;
  port?: number;
  username?: string;
  password?: string;
}

/**
  Axios Request Wrapper function that supports automatic retries based on configuration

  (Also supports Tor Connection for )
  https://github.com/axios/axios/blob/a02fe284dfa9161a548b5c079c43ee0f9dfba053/index.d.ts#L191
**/
export async function fetch(config: fetchConfig): Promise<any> {
  // User-Agent of Tor Browser
  const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0'
  };
  const axiosOptions: axiosOptions = {
    url: (config.socks_enabled === true && config.socks_onion === true && !!config.onion_url) ? (config.onion_url || config.url) : config.url,
    method: config.method ?? 'GET',
    timeout: config.timeout ?? config.socks_enabled ? 30000: 10000,
  };
  if (!!config.responseType) {
    axiosOptions.responseType = config.responseType;
  }
  if (!!config.data) {
    axiosOptions.data = config.data;
  }
  /**
    Should not apply additional headers for browsers
  **/
  if (isBrowser === false) {
    axiosOptions.headers = config.headers ?? defaultHeaders;
  }
  // Use provided axios instance if available
  const axiosInstance = config.axios ?? axios;
  const retryMax = config.retryMax ?? 5;
  const retrySec = config.retrySec ?? 60;
  let retry = 0;
  let error: object = {};

  while (retry < retryMax) {
    try {
      /**
        Browsers don't need tor socket support (Node.js only feature)
      **/
      if (isBrowser === false && config.socks_enabled === true) {
        const socksOptions: socksOptions = {
          agentOptions: {
            keepAlive: true
          },
          hostname: config.socks_host,
          port: config.socks_port
        };

        if (!!config.socks_username && !!config.socks_password) {
          socksOptions.username = config.socks_username;
          socksOptions.password = config.socks_password;
        } else {
          // Retry with different tor circuits https://stackoverflow.com/a/64960234
          socksOptions.username = `circuit${retry}`;
        }

        // Handle proxy agent for onion addresses
        if (getProtocol(axiosOptions.url) === 'http') {
          axiosOptions.httpAgent = new SocksProxyAgent(socksOptions);
        } else {
          axiosOptions.httpsAgent = new SocksProxyAgent(socksOptions);
        }
      }

      const response = await axiosInstance(axiosOptions);

      if (typeof config.callback === 'function') {
        config.callback(response);
      }

      if (response.statusText === 'error' || response.status < 200 || response.status > 299) {
        throw new Error(`HTTP Error ${response.status} while fetching from ${axiosOptions.url}`);
      }

      return response.data;
    } catch (e: any) {
      if (e.response?.config?.url && e.response?.status) {
        console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`);
        if (typeof config.callback === 'function') {
          config.callback(e.response);
        }
      }
      error = serializeError(e);
      await setDelay(retrySec);
      retry++;
    }
  }
  return { error: error };
}

export function get(url: string, config: getConfig): Promise<any> {
  return fetch({ url, ...config });
}

export function post(url: string, data: any, config: getConfig): Promise<any> {
  return fetch({ url, method: 'post', data, ...config });
}

export default fetch;
