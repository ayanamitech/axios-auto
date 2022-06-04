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
 */var $=require("axios");function O(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var j=O($);Promise.any=t=>new Promise((o,n)=>{var a;let s=!1;const u=[];let f=0;const c=[];function h(r){s||(s=!0,o(r))}function d(r){c.push(r),c.length>=f&&n(c)}for(const r of t)f++,u.push(r);for(const r of u)(r==null?void 0:r.then)!==void 0||(r==null?void 0:r.catch)!==void 0?((a=r==null?void 0:r.then(i=>h(i)))==null||a.catch(()=>{}),r==null||r.catch(i=>d(i))):h(r)});var S=Object.defineProperty,_=Object.getOwnPropertySymbols,U=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable,b=(t,o,n)=>o in t?S(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,k=(t,o)=>{for(var n in o||(o={}))U.call(o,n)&&b(t,n,o[n]);if(_)for(var n of _(o))q.call(o,n)&&b(t,n,o[n]);return t};const A=typeof window<"u",E=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),p=t=>new URL(t).protocol.split(":")[0];function F(t,o,n){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},u={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${n}`),p(o)==="http"?u.httpAgent=new a(s):p(o)==="https"&&(u.httpsAgent=new a(s)),u}async function w(t){var o,n,a,s,u,f,c,h,d,r,i;const T={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},l={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:((n=t.timeout)!=null?n:t.socks_enabled)?3e4:1e4,validateStatus:e=>e>=200&&e<300};t.responseType&&(l.responseType=t.responseType),t.data&&(l.data=t.data),A===!1&&(l.headers=(a=t.headers)!=null?a:T);const x=(s=t.axios)!=null?s:j.default,v=(u=t.retryMax)!=null?u:5,P=(f=t.retrySec)!=null?f:60;let g=0;for(;g<v;)try{if(A===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const m=F(t,l.url,g);p(l.url)==="http"?l.httpAgent=m.httpAgent:p(l.url)==="https"&&(l.httpsAgent=m.httpsAgent)}else t.httpAgent&&p(l.url)==="http"?l.httpAgent=t.httpAgent:t.httpsAgent&&p(l.url)==="https"&&(l.httpsAgent=t.httpsAgent);const e=await x(l);if(typeof t.callback=="function"&&t.callback(e),e.statusText==="error")throw new Error(`HTTP ${e.statusText} ${e.status} while fetching from ${l.url}`);if(t.debug===!0&&e.config){const m=(c=e.config.headers)==null?void 0:c["User-Agent"];console.log(`Sending ${(h=e.config.method)==null?void 0:h.toUpperCase()} request to ${e.config.url} using Agent ${m}`)}return e.data}catch(e){if(((r=(d=e.response)==null?void 0:d.config)==null?void 0:r.url)&&((i=e.response)==null?void 0:i.status)&&(t.debug===!0&&console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`),typeof t.callback=="function"&&t.callback(e.response)),v!==1&&await E(P),g===v-1)throw e;g++}}async function y(t,o,n,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(u=>w(k({url:u,method:n,data:a},o)))):w(k({url:t,method:n,data:a},o))}function H(t,o){return y(t,o)}function R(t,o,n){return y(t,n,"post",o)}exports.default=y,exports.fetch=w,exports.get=H,exports.multiFetch=y,exports.post=R;
