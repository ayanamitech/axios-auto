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
 */var x=require("axios");function O(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var P=O(x),j=Object.defineProperty,_=Object.getOwnPropertySymbols,S=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable,b=(t,o,n)=>o in t?j(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,k=(t,o)=>{for(var n in o||(o={}))S.call(o,n)&&b(t,n,o[n]);if(_)for(var n of _(o))U.call(o,n)&&b(t,n,o[n]);return t};const m=typeof window<"u",q=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),v=t=>new URL(t).protocol.split(":")[0];function E(t,o,n){const l=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},a={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${n}`),v(o)==="http"?a.httpAgent=new l(s):a.httpsAgent=new l(s),a}async function i(t){var o,n,l,s,a,p,f,d,g,h,y;const T={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},r={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:((n=t.timeout)!=null?n:t.socks_enabled)?3e4:1e4,validateStatus:e=>e>=200&&e<300};t.responseType&&(r.responseType=t.responseType),t.data&&(r.data=t.data),m===!1&&(r.headers=(l=t.headers)!=null?l:T);const A=(s=t.axios)!=null?s:P.default,w=(a=t.retryMax)!=null?a:5,$=(p=t.retrySec)!=null?p:60;let u=0;for(;u<w;)try{if(m===!1&&t.socks_enabled===!0&&t.socks_proxy_agent){const c=E(t,r.url,u);v(r.url)==="http"?r.httpAgent=c.httpAgent:r.httpsAgent=c.httpsAgent}const e=await A(r);if(typeof t.callback=="function"&&t.callback(e),e.statusText==="error")throw new Error(`HTTP ${e.statusText} ${e.status} while fetching from ${r.url}`);if(t.debug===!0&&e.config){const c=(f=e.config.headers)==null?void 0:f["User-Agent"];console.log(`Sending ${(d=e.config.method)==null?void 0:d.toUpperCase()} request to ${e.config.url} using Agent ${c}`)}return e.data}catch(e){if(((h=(g=e.response)==null?void 0:g.config)==null?void 0:h.url)&&((y=e.response)==null?void 0:y.status)&&(t.debug===!0&&console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`),typeof t.callback=="function"&&t.callback(e.response)),await q($),u===w-1)throw e;u++}}function R(t,o){return i(k({url:t},o))}function C(t,o,n){return i(k({url:t,method:"post",data:o},n))}exports.default=i,exports.fetch=i,exports.get=R,exports.post=C;
