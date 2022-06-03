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
 */import x from"axios";var O=Object.defineProperty,y=Object.getOwnPropertySymbols,P=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable,b=(t,o,e)=>o in t?O(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e,_=(t,o)=>{for(var e in o||(o={}))P.call(o,e)&&b(t,e,o[e]);if(y)for(var e of y(o))S.call(o,e)&&b(t,e,o[e]);return t};const A=typeof window<"u",j=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),l=t=>new URL(t).protocol.split(":")[0];function U(t,o,e){const u=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},a={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${e}`),l(o)==="http"?a.httpAgent=new u(s):l(o)==="https"&&(a.httpsAgent=new u(s)),a}async function i(t){var o,e,u,s,a,f,d,g,w,k,m;const v={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},r={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:((e=t.timeout)!=null?e:t.socks_enabled)?3e4:1e4,validateStatus:n=>n>=200&&n<300};t.responseType&&(r.responseType=t.responseType),t.data&&(r.data=t.data),A===!1&&(r.headers=(u=t.headers)!=null?u:v);const T=(s=t.axios)!=null?s:x,h=(a=t.retryMax)!=null?a:5,$=(f=t.retrySec)!=null?f:60;let c=0;for(;c<h;)try{if(A===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const p=U(t,r.url,c);l(r.url)==="http"?r.httpAgent=p.httpAgent:l(r.url)==="https"&&(r.httpsAgent=p.httpsAgent)}else t.httpAgent&&l(r.url)==="http"?r.httpAgent=t.httpAgent:t.httpsAgent&&l(r.url)==="https"&&(r.httpsAgent=t.httpsAgent);const n=await T(r);if(typeof t.callback=="function"&&t.callback(n),n.statusText==="error")throw new Error(`HTTP ${n.statusText} ${n.status} while fetching from ${r.url}`);if(t.debug===!0&&n.config){const p=(d=n.config.headers)==null?void 0:d["User-Agent"];console.log(`Sending ${(g=n.config.method)==null?void 0:g.toUpperCase()} request to ${n.config.url} using Agent ${p}`)}return n.data}catch(n){if(((k=(w=n.response)==null?void 0:w.config)==null?void 0:k.url)&&((m=n.response)==null?void 0:m.status)&&(t.debug===!0&&console.error(`Request to ${n.response.config.url} failed with code ${n.response.status}`),typeof t.callback=="function"&&t.callback(n.response)),h!==1&&await j($),c===h-1)throw n;c++}}function E(t,o){return i(_({url:t},o))}function R(t,o,e){return i(_({url:t,method:"post",data:o},e))}export{i as default,i as fetch,E as get,R as post};
