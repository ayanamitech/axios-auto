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
 */import x from"axios";var O=Object.defineProperty,m=Object.getOwnPropertySymbols,P=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable,y=(o,t,r)=>t in o?O(o,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[t]=r,b=(o,t)=>{for(var r in t||(t={}))P.call(t,r)&&y(o,r,t[r]);if(m)for(var r of m(t))S.call(t,r)&&y(o,r,t[r]);return o};const _=typeof window<"u",j=o=>new Promise(t=>setTimeout(()=>t(),o*1e3)),v=o=>new URL(o).protocol.split(":")[0];function U(o,t,r){const l=o.socks_proxy_agent,e={agentOptions:{keepAlive:!0},hostname:o.socks_host,port:o.socks_port},a={};return!!o.socks_username&&!!o.socks_password?(e.username=o.socks_username,e.password=o.socks_password):o.socks_isTor===!0&&(e.username=`circuit${r}`),v(t)==="http"?a.httpAgent=new l(e):a.httpsAgent=new l(e),a}async function i(o){var t,r,l,e,a,p,d,f,g,h,w;const T={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},s={url:o.socks_enabled===!0&&o.socks_onion===!0&&!!o.onion_url&&o.onion_url||o.url,method:(t=o.method)!=null?t:"GET",timeout:((r=o.timeout)!=null?r:o.socks_enabled)?3e4:1e4,validateStatus:n=>n>=200&&n<300};o.responseType&&(s.responseType=o.responseType),o.data&&(s.data=o.data),_===!1&&(s.headers=(l=o.headers)!=null?l:T);const A=(e=o.axios)!=null?e:x,k=(a=o.retryMax)!=null?a:5,$=(p=o.retrySec)!=null?p:60;let c=0;for(;c<k;)try{if(_===!1&&o.socks_enabled===!0&&o.socks_proxy_agent){const u=U(o,s.url,c);v(s.url)==="http"?s.httpAgent=u.httpAgent:s.httpsAgent=u.httpsAgent}const n=await A(s);if(typeof o.callback=="function"&&o.callback(n),n.statusText==="error")throw new Error(`HTTP ${n.statusText} ${n.status} while fetching from ${s.url}`);if(o.debug===!0&&n.config){const u=(d=n.config.headers)==null?void 0:d["User-Agent"];console.log(`Sending ${(f=n.config.method)==null?void 0:f.toUpperCase()} request to ${n.config.url} using Agent ${u}`)}return n.data}catch(n){if(((h=(g=n.response)==null?void 0:g.config)==null?void 0:h.url)&&((w=n.response)==null?void 0:w.status)&&(o.debug===!0&&console.error(`Request to ${n.response.config.url} failed with code ${n.response.status}`),typeof o.callback=="function"&&o.callback(n.response)),await j($),c===k-1)throw n;c++}}function E(o,t){return i(b({url:o},t))}function R(o,t,r){return i(b({url:o,method:"post",data:t},r))}export{i as default,i as fetch,E as get,R as post};
