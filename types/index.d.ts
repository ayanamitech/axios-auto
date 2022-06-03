/// <reference types="node" />
/// <reference types="node" />
import { Method, ResponseType, AxiosResponse, AxiosStatic, AxiosRequestHeaders } from 'axios';
import type { Agent as HTTPAgent } from 'http';
import type { Agent as HTTPSAgent } from 'https';
export interface callback {
    (message: AxiosResponse): void;
}
export interface getConfig {
    method?: Method | string;
    headers?: AxiosRequestHeaders;
    timeout?: number;
    responseType?: ResponseType;
    debug?: boolean;
    retryMax?: number;
    retrySec?: number;
    axios?: AxiosStatic;
    callback?: callback;
    httpAgent?: HTTPAgent;
    httpsAgent?: HTTPSAgent;
    withCredentials?: boolean;
    onion_url?: string;
    socks_enabled?: boolean;
    socks_isTor?: boolean;
    socks_proxy_agent?: any;
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
export declare function fetch(config: fetchConfig): Promise<any>;
export declare function get(url: string, config: getConfig): Promise<any>;
export declare function post(url: string, data: any, config: getConfig): Promise<any>;
export default fetch;
