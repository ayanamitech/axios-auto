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
 */var P=require("promise.any"),j=require("axios");function b(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var S=b(P),q=b(j);Promise.any=S.default;var U=Object.defineProperty,k=Object.getOwnPropertySymbols,E=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable,v=(t,e,o)=>e in t?U(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,A=(t,e)=>{for(var o in e||(e={}))E.call(e,o)&&v(t,o,e[o]);if(k)for(var o of k(e))F.call(e,o)&&v(t,o,e[o]);return t};const T=typeof window<"u",H=t=>new Promise(e=>setTimeout(()=>e(),t*1e3)),u=t=>new URL(t).protocol.split(":")[0];function R(t,e,o){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},l={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${o}`),u(e)==="http"?l.httpAgent=new a(s):u(e)==="https"&&(l.httpsAgent=new a(s)),l}async function d(t){var e,o,a,s,l,h,g,y,m,_,w;const x={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},r={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(e=t.method)!=null?e:"GET",timeout:((o=t.timeout)!=null?o:t.socks_enabled)?3e4:1e4,validateStatus:n=>n>=200&&n<300};t.responseType&&(r.responseType=t.responseType),t.data&&(r.data=t.data),T===!1&&(r.headers=(a=t.headers)!=null?a:x);const $=(s=t.axios)!=null?s:q.default,f=(l=t.retryMax)!=null?l:5,O=(h=t.retrySec)!=null?h:60;let c=0;for(;c<f;)try{if(T===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const i=R(t,r.url,c);u(r.url)==="http"?r.httpAgent=i.httpAgent:u(r.url)==="https"&&(r.httpsAgent=i.httpsAgent)}else t.httpAgent&&u(r.url)==="http"?r.httpAgent=t.httpAgent:t.httpsAgent&&u(r.url)==="https"&&(r.httpsAgent=t.httpsAgent);const n=await $(r);if(typeof t.callback=="function"&&t.callback(n),n.statusText==="error")throw new Error(`HTTP ${n.statusText} ${n.status} while fetching from ${r.url}`);if(t.debug===!0&&n.config){const i=(g=n.config.headers)==null?void 0:g["User-Agent"];console.log(`Sending ${(y=n.config.method)==null?void 0:y.toUpperCase()} request to ${n.config.url} using Agent ${i}`)}return n.data}catch(n){if(((_=(m=n.response)==null?void 0:m.config)==null?void 0:_.url)&&((w=n.response)==null?void 0:w.status)&&(t.debug===!0&&console.error(`Request to ${n.response.config.url} failed with code ${n.response.status}`),typeof t.callback=="function"&&t.callback(n.response)),f!==1&&await H(O),c===f-1)throw n;c++}}async function p(t,e,o,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(l=>d(A({url:l,method:o,data:a},e)))):d(A({url:t,method:o,data:a},e))}function C(t,e){return p(t,e)}function G(t,e,o){return p(t,o,"post",e)}exports.default=p,exports.fetch=d,exports.get=C,exports.multiFetch=p,exports.post=G;
