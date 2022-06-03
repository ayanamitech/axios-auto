"use strict";/*!
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
 */var $=require("axios");function O(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var P=O($),j=Object.defineProperty,b=Object.getOwnPropertySymbols,S=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable,k=(t,o,n)=>o in t?j(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,m=(t,o)=>{for(var n in o||(o={}))S.call(o,n)&&k(t,n,o[n]);if(b)for(var n of b(o))U.call(o,n)&&k(t,n,o[n]);return t};const v=typeof window<"u",q=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),l=t=>new URL(t).protocol.split(":")[0];function E(t,o,n){const u=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},a={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${n}`),l(o)==="http"?a.httpAgent=new u(s):l(o)==="https"&&(a.httpsAgent=new u(s)),a}async function p(t){var o,n,u,s,a,d,h,g,y,w,_;const A={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},r={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:((n=t.timeout)!=null?n:t.socks_enabled)?3e4:1e4,validateStatus:e=>e>=200&&e<300};t.responseType&&(r.responseType=t.responseType),t.data&&(r.data=t.data),v===!1&&(r.headers=(u=t.headers)!=null?u:A);const T=(s=t.axios)!=null?s:P.default,f=(a=t.retryMax)!=null?a:5,x=(d=t.retrySec)!=null?d:60;let c=0;for(;c<f;)try{if(v===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const i=E(t,r.url,c);l(r.url)==="http"?r.httpAgent=i.httpAgent:l(r.url)==="https"&&(r.httpsAgent=i.httpsAgent)}else t.httpAgent&&l(r.url)==="http"?r.httpAgent=t.httpAgent:t.httpsAgent&&l(r.url)==="https"&&(r.httpsAgent=t.httpsAgent);const e=await T(r);if(typeof t.callback=="function"&&t.callback(e),e.statusText==="error")throw new Error(`HTTP ${e.statusText} ${e.status} while fetching from ${r.url}`);if(t.debug===!0&&e.config){const i=(h=e.config.headers)==null?void 0:h["User-Agent"];console.log(`Sending ${(g=e.config.method)==null?void 0:g.toUpperCase()} request to ${e.config.url} using Agent ${i}`)}return e.data}catch(e){if(((w=(y=e.response)==null?void 0:y.config)==null?void 0:w.url)&&((_=e.response)==null?void 0:_.status)&&(t.debug===!0&&console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`),typeof t.callback=="function"&&t.callback(e.response)),f!==1&&await q(x),c===f-1)throw e;c++}}function H(t,o){return p(m({url:t},o))}function R(t,o,n){return p(m({url:t,method:"post",data:o},n))}exports.default=p,exports.fetch=p,exports.get=H,exports.post=R;
