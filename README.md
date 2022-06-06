# axios-auto

[![Build Status](https://github.com/ayanamitech/axios-auto/actions/workflows/test.yml/badge.svg)](https://github.com/ayanamitech/axios-auto/actions)
[![NPM Package Version](https://img.shields.io/npm/v/axios-auto.svg)](https://npmjs.org/package/axios-auto)
[![NPM Package Downloads](https://img.shields.io/npm/dm/axios-auto.svg)](https://npmjs.org/package/axios-auto)
[![Known Vulnerabilities](https://snyk.io/test/github/ayanamitech/axios-auto/badge.svg?style=flat-square)](https://snyk.io/test/github/ayanamitech/axios-auto)
[![GitHub Views](https://img.shields.io/badge/dynamic/json?color=green&label=Views&query=uniques&url=https://github.com/ayanamitech/node-github-repo-stats/blob/main/data/ayanamitech/axios-auto/views.json?raw=True&logo=github)](https://github.com/ayanamitech/axios-auto)
[![GitHub Clones](https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=uniques&url=https://github.com/ayanamitech/node-github-repo-stats/blob/main/data/ayanamitech/axios-auto/clone.json?raw=True&logo=github)](https://github.com/ayanamitech/axios-auto)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Usage](#usage)
  - [Browser](#browser)
  - [Example](#example)

## About

> Simple Axios wrapper with basic retry & tor support

`axios-auto` is an easy to use [Axios](https://axios-http.com/) client wrapper function that transforms your favoriate HTTP client library to fault tolerant [client-side load balancer](https://docs.microsoft.com/en-us/aspnet/core/grpc/loadbalancing?view=aspnetcore-6.0).

## Installation

**Node.js**

```sh
# Wouldn't work without axios installed
npm install axios
npm install axios-auto
```

## Documentation

https://ayanamitech.github.io/axios-auto

## Configuration

https://ayanamitech.github.io/axios-auto/interfaces/fetchConfig.html

## Usage

### Browser

Every release of `axios-auto` will have new build of `./dist/browser/index.js` for use in the browser. To get access to module classes use `axios` global variable.

> WARN: We recommend hosting and controlling your own copy for security reasons

```html
<!-- Since Browser bundle comes with axios built in, no need to add additional axios dependency -->
<script src="https://cdn.jsdelivr.net/npm/axios-auto@latest"></script>
```

```html
<!-- Since Browser bundle comes with axios built in, no need to add additional axios dependency -->
<script src="https://unpkg.com/axios-auto@latest"></script>
```

### Example

```js
// CommonJS
const axios = require('axios-auto');

or

const Axios = require('axios');
const axios = require('axios-auto');

// Include axios instance as options
axios.get({...options, axios: Axios });

// ModuleJS (ES6 Modules)
import * as axios from 'axios-auto';

/**
  GET request
**/
axios.get('https://ifconfig.co/json').then(result => {
  // Equivalent to axios.get().then(result => console.log(result.data));
  console.log(result);
}).catch(error => {
  // Equivalent with axios.get().catch(e => console.error(e));
  console.error(error);
});

/**
  POST request
**/
axios.post('https://reqbin.com/echo/post/json', { 'id': 1, 'price': 10000 }).then(result => {
  console.log(result);
}).catch(error => {
  // Equivalent with axios.post().catch(e => console.error(e));
  console.error(error);
});
```

Please checkout [Type Definition](./types/index.d.ts) for required parameters and expected output.
