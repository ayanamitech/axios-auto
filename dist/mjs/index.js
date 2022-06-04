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
 */import O from"promise.any";import P from"axios";Promise.any=O;var S=Object.defineProperty,b=Object.getOwnPropertySymbols,j=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable,_=(t,o,n)=>o in t?S(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,A=(t,o)=>{for(var n in o||(o={}))j.call(o,n)&&_(t,n,o[n]);if(b)for(var n of b(o))U.call(o,n)&&_(t,n,o[n]);return t};const v=typeof window<"u",E=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),u=t=>new URL(t).protocol.split(":")[0];function R(t,o,n){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},l={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${n}`),u(o)==="http"?l.httpAgent=new a(s):u(o)==="https"&&(l.httpsAgent=new a(s)),l}async function f(t){var o,n,a,s,l,d,g,m,y,w,k;const T={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},r={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:((n=t.timeout)!=null?n:t.socks_enabled)?3e4:1e4,validateStatus:e=>e>=200&&e<300};t.responseType&&(r.responseType=t.responseType),t.data&&(r.data=t.data),v===!1&&(r.headers=(a=t.headers)!=null?a:T);const x=(s=t.axios)!=null?s:P,h=(l=t.retryMax)!=null?l:5,$=(d=t.retrySec)!=null?d:60;let c=0;for(;c<h;)try{if(v===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const i=R(t,r.url,c);u(r.url)==="http"?r.httpAgent=i.httpAgent:u(r.url)==="https"&&(r.httpsAgent=i.httpsAgent)}else t.httpAgent&&u(r.url)==="http"?r.httpAgent=t.httpAgent:t.httpsAgent&&u(r.url)==="https"&&(r.httpsAgent=t.httpsAgent);const e=await x(r);if(typeof t.callback=="function"&&t.callback(e),e.statusText==="error")throw new Error(`HTTP ${e.statusText} ${e.status} while fetching from ${r.url}`);if(t.debug===!0&&e.config){const i=(g=e.config.headers)==null?void 0:g["User-Agent"];console.log(`Sending ${(m=e.config.method)==null?void 0:m.toUpperCase()} request to ${e.config.url} using Agent ${i}`)}return e.data}catch(e){if(((w=(y=e.response)==null?void 0:y.config)==null?void 0:w.url)&&((k=e.response)==null?void 0:k.status)&&(t.debug===!0&&console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`),typeof t.callback=="function"&&t.callback(e.response)),h!==1&&await E($),c===h-1)throw e;c++}}async function p(t,o,n,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(l=>f(A({url:l,method:n,data:a},o)))):f(A({url:t,method:n,data:a},o))}function q(t,o){return p(t,o)}function C(t,o,n){return p(t,n,"post",o)}export{p as default,f as fetch,q as get,p as multiFetch,C as post};
