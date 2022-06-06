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
 */var j=require("promise.any"),C=require("axios");function A(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var q=A(j),S=A(C);Promise.any=q.default;var U=Object.defineProperty,E=Object.defineProperties,F=Object.getOwnPropertyDescriptors,T=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable,O=(t,e,o)=>e in t?U(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,c=(t,e)=>{for(var o in e||(e={}))R.call(e,o)&&O(t,o,e[o]);if(T)for(var o of T(e))D.call(e,o)&&O(t,o,e[o]);return t},f=(t,e)=>E(t,F(e));const P=typeof window<"u",G=t=>new Promise(e=>setTimeout(()=>e(),t*1e3)),u=t=>new URL(t).protocol.split(":")[0];function H(t,e,o){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},l={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${o}`),u(e)==="http"?l.httpAgent=new a(s):u(e)==="https"&&(l.httpsAgent=new a(s)),l}async function g(t){var e,o,a,s,l,y,b,k,m,_,v,w;const n={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(e=t.method)!=null?e:"GET",timeout:(o=t.timeout)!=null?o:t.socks_enabled?3e4:1e4,validateStatus:r=>r>=200&&r<300,headers:(a=t.headers)!=null?a:{}};t.responseType&&(n.responseType=t.responseType),t.data&&(n.data=t.data),P===!1&&((s=n.headers)["User-Agent"]||(s["User-Agent"]="Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"));const $=(l=t.axios)!=null?l:S.default,d=(y=t.retryMax)!=null?y:5,x=(b=t.retrySec)!=null?b:60;let i=0;for(;i<=d;)try{if(P===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const p=H(t,n.url,i);u(n.url)==="http"?n.httpAgent=p.httpAgent:u(n.url)==="https"&&(n.httpsAgent=p.httpsAgent)}else t.httpAgent&&u(n.url)==="http"?n.httpAgent=t.httpAgent:t.httpsAgent&&u(n.url)==="https"&&(n.httpsAgent=t.httpsAgent);const r=await $(n);if(r.statusText==="error")throw new Error(`HTTP ${r.statusText} ${r.status} while fetching from ${n.url}`);if(i++,typeof t.callback=="function"&&t.callback(f(c({},r),{error:!1,count:i})),t.debug===!0&&r.config){const p=(k=r.config.headers)==null?void 0:k["User-Agent"];console.log(`Sending ${(m=r.config.method)==null?void 0:m.toUpperCase()} request to ${r.config.url} using Agent ${p}`)}return typeof t.finishCallback=="function"&&t.finishCallback(f(c({},r),{error:null})),r.data}catch(r){if(((v=(_=r.response)==null?void 0:_.config)==null?void 0:v.url)&&((w=r.response)==null?void 0:w.status)&&(t.debug===!0&&console.error(`Request to ${r.response.config.url} failed with code ${r.response.status}`),typeof t.callback=="function"&&t.callback(f(c({},r.response),{error:!0,count:i}))),d!==0&&await G(x),i>=d)throw typeof t.finishCallback=="function"&&(r.response?t.finishCallback(f(c({},r.response),{error:r})):t.finishCallback({config:n,error:r})),r}}async function h(t,e,o,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(l=>g(c({url:l,method:o,data:a},e)))):g(c({url:t,method:o,data:a},e))}function L(t,e){return h(t,e)}function M(t,e,o){return h(t,o,"post",e)}exports.default=h,exports.fetch=g,exports.get=L,exports.multiFetch=h,exports.post=M;
