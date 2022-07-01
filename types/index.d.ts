/// <reference types="node" />
/// <reference types="node" />
import './promise';
import { Method, ResponseType, AxiosResponse, AxiosStatic, AxiosRequestHeaders, AxiosResponseHeaders, AxiosRequestConfig } from 'axios';
import type { Agent as HTTPAgent } from 'http';
import type { Agent as HTTPSAgent } from 'https';
export interface AxiosResponseExtended extends AxiosResponse {
    error: boolean;
    count: number;
}
export interface AxiosResponseResult {
    data?: any;
    status?: number;
    statusText?: string;
    headers?: AxiosResponseHeaders;
    config: AxiosRequestConfig;
    request?: any;
    error: null | Error;
}
export interface callback {
    (message: AxiosResponseExtended): void;
}
export interface finishCallback {
    (message: AxiosResponseResult): void;
}
export interface fetchConfig {
    url: string;
    method?: Method | string;
    headers?: AxiosRequestHeaders;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    responseType?: ResponseType;
    debug?: boolean;
    retryMax?: number;
    retrySec?: number;
    axios?: AxiosStatic;
    callback?: callback;
    finishCallback?: finishCallback;
    httpAgent?: HTTPAgent;
    httpsAgent?: HTTPSAgent;
    socks_proxy_agent?: any;
    socks_enabled?: boolean;
    socks_isTor?: boolean;
    onion_url?: string;
    socks_onion?: boolean;
    socks_host?: string;
    socks_port?: number;
    socks_username?: string;
    socks_password?: string;
}
export declare type getConfig = Omit<fetchConfig, 'url' | 'data'>;
export declare function fetch(config: fetchConfig): Promise<any>;
export declare function multiFetch(url: string, config?: getConfig, method?: string, data?: any): Promise<any>;
export declare function get(url: string, config?: getConfig): Promise<any>;
export declare function post(url: string, data: any, config?: getConfig): Promise<any>;
declare const _default: {
    fetch: typeof fetch;
    multiFetch: typeof multiFetch;
    get: typeof get;
    post: typeof post;
};
export default _default;
