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
 */var j=require("promise.any"),C=require("axios");function w(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var S=w(j),q=w(C);Promise.any=S.default;var U=Object.defineProperty,E=Object.defineProperties,F=Object.getOwnPropertyDescriptors,A=Object.getOwnPropertySymbols,M=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable,T=(t,e,r)=>e in t?U(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,i=(t,e)=>{for(var r in e||(e={}))M.call(e,r)&&T(t,r,e[r]);if(A)for(var r of A(e))R.call(e,r)&&T(t,r,e[r]);return t},f=(t,e)=>E(t,F(e));const O=typeof window<"u",D=t=>new Promise(e=>setTimeout(()=>e(),t*1e3)),c=t=>new URL(t).protocol.split(":")[0];function G(t,e,r){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},l={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${r}`),c(e)==="http"?l.httpAgent=new a(s):c(e)==="https"&&(l.httpsAgent=new a(s)),l}async function g(t){var e,r,a,s,l,y,b,k,m,_,v;const $={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},n={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(e=t.method)!=null?e:"GET",timeout:((r=t.timeout)!=null?r:t.socks_enabled)?3e4:1e4,validateStatus:o=>o>=200&&o<300};t.responseType&&(n.responseType=t.responseType),t.data&&(n.data=t.data),O===!1&&(n.headers=(a=t.headers)!=null?a:$);const P=(s=t.axios)!=null?s:q.default,d=(l=t.retryMax)!=null?l:5,x=(y=t.retrySec)!=null?y:60;let u=0;for(;u<d;)try{if(O===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const p=G(t,n.url,u);c(n.url)==="http"?n.httpAgent=p.httpAgent:c(n.url)==="https"&&(n.httpsAgent=p.httpsAgent)}else t.httpAgent&&c(n.url)==="http"?n.httpAgent=t.httpAgent:t.httpsAgent&&c(n.url)==="https"&&(n.httpsAgent=t.httpsAgent);const o=await P(n);if(typeof t.callback=="function"&&t.callback(f(i({},o),{error:!1})),o.statusText==="error")throw new Error(`HTTP ${o.statusText} ${o.status} while fetching from ${n.url}`);if(t.debug===!0&&o.config){const p=(b=o.config.headers)==null?void 0:b["User-Agent"];console.log(`Sending ${(k=o.config.method)==null?void 0:k.toUpperCase()} request to ${o.config.url} using Agent ${p}`)}return typeof t.finishCallback=="function"&&t.finishCallback(f(i({},o),{error:null})),o.data}catch(o){if(((_=(m=o.response)==null?void 0:m.config)==null?void 0:_.url)&&((v=o.response)==null?void 0:v.status)&&(t.debug===!0&&console.error(`Request to ${o.response.config.url} failed with code ${o.response.status}`),typeof t.callback=="function"&&t.callback(f(i({},o.response),{error:!0}))),d!==1&&await D(x),u===d-1)throw typeof t.finishCallback=="function"&&(o.response?t.finishCallback(f(i({},o.response),{error:o})):t.finishCallback({config:n,error:o})),o;u++}}async function h(t,e,r,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(l=>g(i({url:l,method:r,data:a},e)))):g(i({url:t,method:r,data:a},e))}function H(t,e){return h(t,e)}function L(t,e,r){return h(t,r,"post",e)}exports.default=h,exports.fetch=g,exports.get=H,exports.multiFetch=h,exports.post=L;
