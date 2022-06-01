import { Method, ResponseType, AxiosResponse, AxiosStatic, AxiosRequestHeaders } from 'axios';
export interface callback {
    (message: AxiosResponse): void;
}
export interface getConfig {
    method?: Method | string;
    headers?: AxiosRequestHeaders;
    timeout?: number;
    responseType?: ResponseType;
    retryMax?: number;
    retrySec?: number;
    axios?: AxiosStatic;
    callback?: callback;
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
export declare function fetch(config: fetchConfig): Promise<any>;
export declare function get(url: string, config: getConfig): Promise<any>;
export declare function post(url: string, data: any, config: getConfig): Promise<any>;
export default fetch;
