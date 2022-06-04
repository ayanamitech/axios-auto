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
 */import x from"promise.any";import C from"axios";Promise.any=x;var j=Object.defineProperty,S=Object.defineProperties,U=Object.getOwnPropertyDescriptors,_=Object.getOwnPropertySymbols,q=Object.prototype.hasOwnProperty,E=Object.prototype.propertyIsEnumerable,A=(t,o,n)=>o in t?j(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,i=(t,o)=>{for(var n in o||(o={}))q.call(o,n)&&A(t,n,o[n]);if(_)for(var n of _(o))E.call(o,n)&&A(t,n,o[n]);return t},f=(t,o)=>S(t,U(o));const T=typeof window<"u",R=t=>new Promise(o=>setTimeout(()=>o(),t*1e3)),u=t=>new URL(t).protocol.split(":")[0];function F(t,o,n){const a=t.socks_proxy_agent,s={agentOptions:{keepAlive:!0},hostname:t.socks_host,port:t.socks_port},l={};return!!t.socks_username&&!!t.socks_password?(s.username=t.socks_username,s.password=t.socks_password):t.socks_isTor===!0&&(s.username=`circuit${n}`),u(o)==="http"?l.httpAgent=new a(s):u(o)==="https"&&(l.httpsAgent=new a(s)),l}async function d(t){var o,n,a,s,l,m,b,y,k,w,v;const O={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0"},e={url:t.socks_enabled===!0&&t.socks_onion===!0&&!!t.onion_url&&t.onion_url||t.url,method:(o=t.method)!=null?o:"GET",timeout:(n=t.timeout)!=null?n:t.socks_enabled?3e4:1e4,validateStatus:r=>r>=200&&r<300};t.responseType&&(e.responseType=t.responseType),t.data&&(e.data=t.data),T===!1&&(e.headers=(a=t.headers)!=null?a:O);const P=(s=t.axios)!=null?s:C,g=(l=t.retryMax)!=null?l:5,$=(m=t.retrySec)!=null?m:60;let c=0;for(;c<=g;)try{if(T===!1)if(t.socks_enabled===!0&&t.socks_proxy_agent){const p=F(t,e.url,c);u(e.url)==="http"?e.httpAgent=p.httpAgent:u(e.url)==="https"&&(e.httpsAgent=p.httpsAgent)}else t.httpAgent&&u(e.url)==="http"?e.httpAgent=t.httpAgent:t.httpsAgent&&u(e.url)==="https"&&(e.httpsAgent=t.httpsAgent);const r=await P(e);if(r.statusText==="error")throw new Error(`HTTP ${r.statusText} ${r.status} while fetching from ${e.url}`);if(c++,typeof t.callback=="function"&&t.callback(f(i({},r),{error:!1,count:c})),t.debug===!0&&r.config){const p=(b=r.config.headers)==null?void 0:b["User-Agent"];console.log(`Sending ${(y=r.config.method)==null?void 0:y.toUpperCase()} request to ${r.config.url} using Agent ${p}`)}return typeof t.finishCallback=="function"&&t.finishCallback(f(i({},r),{error:null})),r.data}catch(r){if(((w=(k=r.response)==null?void 0:k.config)==null?void 0:w.url)&&((v=r.response)==null?void 0:v.status)&&(t.debug===!0&&console.error(`Request to ${r.response.config.url} failed with code ${r.response.status}`),typeof t.callback=="function"&&t.callback(f(i({},r.response),{error:!0,count:c}))),g!==0&&await R($),c>=g)throw typeof t.finishCallback=="function"&&(r.response?t.finishCallback(f(i({},r.response),{error:r})):t.finishCallback({config:e,error:r})),r}}async function h(t,o,n,a){const s=t.replace(/\s+/g,"").split(",");return s.length!==1?Promise.any(s.map(l=>d(i({url:l,method:n,data:a},o)))):d(i({url:t,method:n,data:a},o))}function G(t,o){return h(t,o)}function H(t,o,n){return h(t,n,"post",o)}export{h as default,d as fetch,G as get,h as multiFetch,H as post};
