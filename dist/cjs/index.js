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
 */var j=require("promise.any"),C=require("axios");function w(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var q=w(j),S=w(C);Promise.any=q.default;var U=Object.defineProperty,E=Object.defineProperties,F=Object.getOwnPropertyDescriptors,A=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable,T=(t,o,r)=>o in t?U(t,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[o]=r,i=(t,o)=>{for(var r in o||(o={}))R.call(o,r)&&T(t,r,o[r]);if(A)for(var r of A(o))D.call(o,r)&&T(t,r,o[r]);return t},f=(t,o)=>E(t,F(o));const O=typeof window<"u",G=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),u=t=>new URL(t).protocol.split(":")[0];function H(t,o,r){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},l={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${r}`),u(o)==="http"?l.httpAgent=new a(s):u(o)==="https"&&(l.httpsAgent=new a(s)),l}async function g(t){var o,r,a,s,l,y,b,k,m,v,_;const P={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},n={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:(r=t.timeout)!=null?r:t.socks_enabled?3e4:1e4,validateStatus:e=>e>=200&&e<300};t.responseType&&(n.responseType=t.responseType),t.data&&(n.data=t.data),O===!1&&(n.headers=(a=t.headers)!=null?a:P);const $=(s=t.axios)!=null?s:S.default,d=(l=t.retryMax)!=null?l:5,x=(y=t.retrySec)!=null?y:60;let c=0;for(;c<=d;)try{if(O===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const p=H(t,n.url,c);u(n.url)==="http"?n.httpAgent=p.httpAgent:u(n.url)==="https"&&(n.httpsAgent=p.httpsAgent)}else t.httpAgent&&u(n.url)==="http"?n.httpAgent=t.httpAgent:t.httpsAgent&&u(n.url)==="https"&&(n.httpsAgent=t.httpsAgent);const e=await $(n);if(e.statusText==="error")throw new Error(`HTTP ${e.statusText} ${e.status} while fetching from ${n.url}`);if(c++,typeof t.callback=="function"&&t.callback(f(i({},e),{error:!1,count:c})),t.debug===!0&&e.config){const p=(b=e.config.headers)==null?void 0:b["User-Agent"];console.log(`Sending ${(k=e.config.method)==null?void 0:k.toUpperCase()} request to ${e.config.url} using Agent ${p}`)}return typeof t.finishCallback=="function"&&t.finishCallback(f(i({},e),{error:null})),e.data}catch(e){if(((v=(m=e.response)==null?void 0:m.config)==null?void 0:v.url)&&((_=e.response)==null?void 0:_.status)&&(t.debug===!0&&console.error(`Request to ${e.response.config.url} failed with code ${e.response.status}`),typeof t.callback=="function"&&t.callback(f(i({},e.response),{error:!0,count:c}))),d!==0&&await G(x),c>=d)throw typeof t.finishCallback=="function"&&(e.response?t.finishCallback(f(i({},e.response),{error:e})):t.finishCallback({config:n,error:e})),e}}async function h(t,o,r,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(l=>g(i({url:l,method:r,data:a},o)))):g(i({url:t,method:r,data:a},o))}function L(t,o){return h(t,o)}function M(t,o,r){return h(t,r,"post",o)}exports.default=h,exports.fetch=g,exports.get=L,exports.multiFetch=h,exports.post=M;
