var invOp;invOp =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initializeMap": () => /* binding */ initializeMap,
/* harmony export */   "setFeatureLayerViewFilter": () => /* binding */ setFeatureLayerViewFilter,
/* harmony export */   "getInvestmentFullLayerExtent": () => /* binding */ getInvestmentFullLayerExtent
/* harmony export */ });
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! esri-loader */ "./node_modules/esri-loader/dist/umd/esri-loader.js");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_arc_gis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/arc-gis */ "./src/services/arc-gis.js");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.scss */ "./src/styles.scss");
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./configs.json */ "./src/configs.json");
/* harmony import */ var _plugins_test__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugins/test */ "./src/plugins/test.js");
/* harmony import */ var _plugins_activity_filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins/activity-filter */ "./src/plugins/activity-filter.js");
/* harmony import */ var _plugins_amana_filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugins/amana-filter */ "./src/plugins/amana-filter.js");
/* harmony import */ var _plugins_investment_filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./plugins/investment-filter */ "./src/plugins/investment-filter.js");
/* harmony import */ var _plugins_search_plugin__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./plugins/search-plugin */ "./src/plugins/search-plugin.js");
/* harmony import */ var _plugins_query_layers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./plugins/query-layers */ "./src/plugins/query-layers.js");










let mapView = null;
let data = {
  config: _configs_json__WEBPACK_IMPORTED_MODULE_3__
};
let investmentFLayer = null;
let mapExtentOnChange;

let initializeMap = async () => {
  const optionsModules = {
    // tell Dojo where to load other packages
    dojoConfig: {
      locale: "en",
      parseOnLoad: true
    }
  };
  const [MapView, WebMap, esriConfig, urlUtils, clusterLabelCreator] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/views/MapView", "esri/WebMap", "esri/config", "esri/core/urlUtils", "esri/smartMapping/labels/clusters"], optionsModules);
  urlUtils.addProxyRule({
    urlPrefix: data.config.proxy.urlPrefix,
    proxyUrl: data.config.proxy.proxyUrl
  });
  esriConfig.request.forceProxy = true;
  var webmap = new WebMap({
    basemap: 'streets'
  });
  mapView = new MapView({
    map: webmap,
    container: 'mapView'
  });
  console.log('mapView is ready', mapView);
  mapView.goTo(data.config.mapExtent); // console.log(data);

  _configs_json__WEBPACK_IMPORTED_MODULE_3__.mapView = mapView;
  investmentFLayer = await getInvestmentLayer(data.config.layers[0].url);
  investmentFLayer.when(async function (feature) {
    const [FieldInfoFormat] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/popup/support/FieldInfoFormat"]);
    console.log('start when finished render');
    console.log(investmentFLayer);
    console.log(feature);
    investmentFLayer.popupTemplate = {
      title: "{OPPORTUNITYDESCRIPTION}",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "AMANA",
          label: "الامانة"
        }, {
          fieldName: "BALADYA",
          label: "البلدية"
        }, {
          fieldName: "RFPPRICE",
          label: "سعر الكراسة"
        }, {
          fieldName: "ENDDATE",
          label: "اخر موعد لبيع الكراسة"
        }, {
          fieldName: "OPPORTUNITYTYPE",
          label: "نوع الاستثمار"
        }]
      }],
      actions: [applyToOppertunity, getLocation]
    };
  });
  let currentDate = new Date().toISOString().slice(0, 10);
  let exprssion = `${data.config.layers[0].where} '${currentDate}'`;
  _configs_json__WEBPACK_IMPORTED_MODULE_3__.data.investmentFLayer = investmentFLayer;
  setFeatureLayerViewFilter(investmentFLayer, exprssion);
  console.log(investmentFLayer);
  mapView.map.add(investmentFLayer);
  debugger;
  addWatchEvent(mapView);
  (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.BasemapToggle)(mapView, "bottom-left");
  (0,_plugins_search_plugin__WEBPACK_IMPORTED_MODULE_8__.addSearchWidget)(mapView, "top-right");
  getInvestmentFullLayerExtent(mapView, investmentFLayer);
  setInvestmentcluster(investmentFLayer);
  (0,_plugins_investment_filter__WEBPACK_IMPORTED_MODULE_7__.investmentType_filter)();
  (0,_plugins_activity_filter__WEBPACK_IMPORTED_MODULE_5__.activety_filter)();
  (0,_plugins_amana_filter__WEBPACK_IMPORTED_MODULE_6__.Amana_filter)(mapView);
  (0,_plugins_query_layers__WEBPACK_IMPORTED_MODULE_9__.clickOnFilterButton)();
  (0,_plugins_query_layers__WEBPACK_IMPORTED_MODULE_9__.MapRadioChange)();
  debugger;
  (0,_plugins_query_layers__WEBPACK_IMPORTED_MODULE_9__.OnStartFilter)(_configs_json__WEBPACK_IMPORTED_MODULE_3__, mapExtentOnChange);
  (0,_plugins_query_layers__WEBPACK_IMPORTED_MODULE_9__.addSketchGraphicLayer)(mapView);
  mapView.popup.on("trigger-action", function (event) {
    if (event.action.id === "Oppertunity-this") {
      OppertunityThis('https://furas.momra.gov.sa/prweb/PRAuth/kfOVNCZrb4T3wtJuZgwDZA9k0CM2UeKm*/!STANDARD?pzuiactionzzz=CXtpbn1obzBmNlF4aUxCSW05S2tYc01OVTErRGEvWlFUYlF4bVkxWkxGbG9KTlN4MkJnc1RLTCtXNzlzZlNYSENSZXQ0*');
    }

    if (event.action.id === "sendToGoogle") {
      getCoordinateToSendGoogle(mapView);
    }
  });
};

var applyToOppertunity = {
  title: "التقديم",
  id: "Oppertunity-this",
  image: 'assets/images/apply_application.svg'
};
var getLocation = {
  title: 'googleMap',
  id: 'sendToGoogle',
  image: 'assets/images/locations.svg'
};

function OppertunityThis(url) {
  window.open(url, '_blank');
}

async function getCoordinateToSendGoogle(mapView) {
  mapView.on('click', async event => {
    mapView.hitTest(event).then(async response => {
      console.log(response.results[0].mapPoint.x, response.results[0].mapPoint.y);
      let x = await (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.webMercatorToGeographic)(response.results[0].mapPoint.x);
      let y = await (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.webMercatorToGeographic)(response.results[0].mapPoint.y);
      window.open(`https://www.google.com/maps?q=${y},${x}&z=11`, '_blank');
    });
  });
}

const setInvestmentcluster = layer => {
  layer.featureReduction = {
    type: "cluster",
    clusterRadius: "100px",
    // popupTemplate: {
    //   content: "This cluster represents {cluster_count} earthquakes."
    // },
    // You should adjust the clusterMinSize to properly fit labels
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [{
      // turn off deconfliction to ensure all clusters are labeled
      deconflictionStrategy: "none",
      labelExpressionInfo: {
        expression: "Text($feature.cluster_count, '#,###')"
      },
      symbol: {
        type: "text",
        color: "black",
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "20px"
        }
      },
      labelPlacement: "center-center"
    }]
  };
};

const returnAllData = () => {
  let arr = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "201", "202", "203", "204", "205", "206", "207"];
  let valInfo = [];

  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    valInfo.push({
      value: element,
      symbol: (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.fursaViewerImagePointSymbol)(element)
    });
  }

  console.log(valInfo);
  return valInfo;
};

const setFeatureLayerRenderer = field => {
  let data = returnAllData();
  let renderer = {
    type: "unique-value",
    field: field,
    defaultSymbol: (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.fursaViewerImagePointSymbol)("0"),
    uniqueValueInfos: data
  };
  return renderer;
};

const setFeatureLayerViewFilter = (featureLayer, expression) => {
  featureLayer.definitionExpression = expression; //featureLayer.renderer = setFeatureLayerRenderer("ACTIVITYTYPEID");
};

const zoomToClusterExtent = graghic => {};

const getInvestmentFullLayerExtent = (mapView, layer) => {
  layer.when(() => {
    mapView.extent = layer.fullExtent;
  });
};

const getInvestmentLayer = async url => {
  let render = setFeatureLayerRenderer("ACTIVITYTYPEID");
  return await (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.getFeatureLayer)(url, render);
};

const addWatchEvent = async function (mapView) {
  const [watchUtils] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/core/watchUtils"]);
  watchUtils.whenTrue(mapView, "stationary", function () {
    watchUtils.whenFalseOnce(mapView, "updating", val => {
      if (mapView.extent) {
        _configs_json__WEBPACK_IMPORTED_MODULE_3__.mapExtent = mapView.extent;
      }
    });
  });
};



/***/ }),

/***/ "./src/plugins/activity-filter.js":
/*!****************************************!*\
  !*** ./src/plugins/activity-filter.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "activety_filter": () => /* binding */ activety_filter
/* harmony export */ });
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../configs.json */ "./src/configs.json");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "./src/index.js");



const axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");

const activety_filter = () => {
  let data = [];
  axios.get(_configs_json__WEBPACK_IMPORTED_MODULE_0__.API.activityAPI).then(function (response) {
    for (let index = 0; index < response.data.pxResults.length; index++) {
      const element = response.data.pxResults[index];
      data.push({
        ID: element.ID,
        Name: element.Name
      });
    }

    $(".loadingActivities").remove();
    createSelectControl(data);
  }).catch(function (error) {
    console.log(error);
  });
};

const createSelectControl = data => {
  var parent = document.getElementById("activities");
  var selectList = document.createElement("select");
  selectList.id = "activitiesSelect";
  selectList.className = "form-control";
  selectList.onchange = _onChange;
  parent.appendChild(selectList);
  let content;

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    content += `<option value="${element.ID}">${element.Name}</option>`;
  }

  $("#activitiesSelect").append('<option value="1=1">كل الانشطة</option>');
  $("#activitiesSelect").append(content);
};

const _onChange = event => {
  console.log(event.target.value);
  let exprssion = `ACTIVITYTYPEID='${event.target.value}'`;

  if (event.target.value != '1=1') {
    (0,_index__WEBPACK_IMPORTED_MODULE_1__.setFeatureLayerViewFilter)(_configs_json__WEBPACK_IMPORTED_MODULE_0__.data.investmentFLayer, exprssion);
  } else {
    let currentDate = new Date().toISOString().slice(0, 10);
    let exprssion = `${_configs_json__WEBPACK_IMPORTED_MODULE_0__.layers[0].where} '${currentDate}'`;
    (0,_index__WEBPACK_IMPORTED_MODULE_1__.setFeatureLayerViewFilter)(_configs_json__WEBPACK_IMPORTED_MODULE_0__.data.investmentFLayer, exprssion);
  }
};



/***/ }),

/***/ "./src/plugins/amana-filter.js":
/*!*************************************!*\
  !*** ./src/plugins/amana-filter.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Amana_filter": () => /* binding */ Amana_filter
/* harmony export */ });
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! esri-loader */ "./node_modules/esri-loader/dist/umd/esri-loader.js");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../configs.json */ "./src/configs.json");
/* harmony import */ var _services_arc_gis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/arc-gis */ "./src/services/arc-gis.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../index */ "./src/index.js");



 // import {  } from './services/arc-gis';

const axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");

let mapView = null;

const Amana_filter = mapView => {
  mapView = mapView;
  axios.get(_configs_json__WEBPACK_IMPORTED_MODULE_1__.municipalityFilter.AmanaServiceURL).then(function (response) {
    _configs_json__WEBPACK_IMPORTED_MODULE_1__.amana = response.data.features;
    let data = _configs_json__WEBPACK_IMPORTED_MODULE_1__.amana.map(item => item.attributes);
    console.log(data);
    console.log(_configs_json__WEBPACK_IMPORTED_MODULE_1__);
    $(".loadingAmanat").remove();
    $(".loadingMunicipalities").remove();
    createSelectControl(data);
    console.log(mapView);
  }).catch(function (error) {
    console.log(error);
  });
};

const createSelectControl = data => {
  var parent = document.getElementById("amana");
  var selectList = document.createElement("select");
  selectList.id = "amanaSelect";
  selectList.className = "form-control";
  selectList.onchange = _onChange;
  parent.appendChild(selectList);
  let content;

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    content += `<option value="${element.AMANACODE}">${element.AMANAARNAME}</option>`;
  }

  $("#amanaSelect").append('<option value="1=1">كل الامانات</option>');
  $("#amanaSelect").append(content);
  municipalities();
};

const _onChange = event => {
  console.log(event.target.value);
  municipalitiesByAmana(event.target.value);
};

const municipalities = () => {
  var parent = document.getElementById("municipalities");
  var selectList = document.createElement("select");
  selectList.id = "municipalitiesSelect";
  selectList.className = "form-control";
  selectList.disabled = true;
  selectList.onchange = _MunicipalityOnChange;
  parent.appendChild(selectList);
  $("#municipalitiesSelect").append('<option value="1=1">كل البلديات</option>');
};

const municipalitiesByAmana = value => {
  let url = _configs_json__WEBPACK_IMPORTED_MODULE_1__.municipalityFilter.BaladyaServiceURL;

  if (value && value != "1=1") {
    let code = value;
    let newOne = "where=AMANACODE=";
    let res = newOne.concat(code);
    console.log(res);
    let municipalityUrl = url.replace('where=1=1', res);
    axios.get(municipalityUrl).then(function (response) {
      _configs_json__WEBPACK_IMPORTED_MODULE_1__.municipalities = response.data.features;
      createMunicipalitySelectControl(response.data.features.map(item => item.attributes));
      console.log(_configs_json__WEBPACK_IMPORTED_MODULE_1__);
    }).catch(function (error) {
      console.log(error);
    });
    let amanaIndex = _configs_json__WEBPACK_IMPORTED_MODULE_1__.amana.findIndex(item => item.attributes.AMANACODE == value);
    let amanaGeometry = _configs_json__WEBPACK_IMPORTED_MODULE_1__.amana[amanaIndex].geometry;
    zoomToMapUsingAmanaCode(amanaGeometry);
    console.log(amanaGeometry);
  } else {
    $('#municipalitiesSelect option').remove();
    $("#municipalitiesSelect").append('<option value="1=1">كل البلديات</option>');
    $("#municipalitiesSelect").prop("disabled", true);
    _configs_json__WEBPACK_IMPORTED_MODULE_1__.mapView.graphics.removeAll();
    (0,_index__WEBPACK_IMPORTED_MODULE_3__.getInvestmentFullLayerExtent)(_configs_json__WEBPACK_IMPORTED_MODULE_1__.mapView, _configs_json__WEBPACK_IMPORTED_MODULE_1__.data.investmentFLayer);
  }
};

const zoomToMapUsingAmanaCode = async geomerty => {
  const [Polygon] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/geometry/Polygon"]);
  const polygon = new Polygon({
    hasM: true,
    hasZ: true,
    rings: geomerty.rings,
    spatialReference: {
      wkid: 4326
    }
  });
  let map = _configs_json__WEBPACK_IMPORTED_MODULE_1__.mapView;

  if (map) {
    addGraghicToMap(map, polygon);
    map.goTo(polygon);
  }
};

const addGraghicToMap = async (mapView, geometry) => {
  mapView.graphics.removeAll();
  let highlight_feature = await highlight_featuresOnSelect(geometry);
  mapView.graphics.add(highlight_feature);
};

const highlight_featuresOnSelect = async geometry => {
  const [Graphic] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/Graphic"]);
  let symbol = (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_2__.getPolygonSymbolWithoutOutLine)();
  const selectedGraphic = new Graphic({
    geometry: geometry,
    symbol: symbol
  });
  return selectedGraphic;
};

const createMunicipalitySelectControl = data => {
  $('#municipalitiesSelect option').remove();
  $("#municipalitiesSelect").append('<option value="1=1">كل البلديات</option>');
  let content;

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    content += `<option value="${element.MUNICIPALITYCODE}">${element.MUNICIPALITYARNAME}</option>`;
  }

  $("#municipalitiesSelect").append(content);
  $("#municipalitiesSelect").prop("disabled", false);
};

const _MunicipalityOnChange = event => {
  if (event.target.value != "1=1") {
    let MunicipalityIndex = _configs_json__WEBPACK_IMPORTED_MODULE_1__.municipalities.findIndex(item => item.attributes.MUNICIPALITYCODE == event.target.value);
    let MunicipalityGeometry = _configs_json__WEBPACK_IMPORTED_MODULE_1__.municipalities[MunicipalityIndex].geometry;
    zoomToMapUsingMunicipalityCode(MunicipalityGeometry);
  } else {
    _configs_json__WEBPACK_IMPORTED_MODULE_1__.mapView.graphics.removeAll();
    (0,_index__WEBPACK_IMPORTED_MODULE_3__.getInvestmentFullLayerExtent)(_configs_json__WEBPACK_IMPORTED_MODULE_1__.mapView, _configs_json__WEBPACK_IMPORTED_MODULE_1__.data.investmentFLayer);
  }
};

const zoomToMapUsingMunicipalityCode = async geomerty => {
  const [Polygon] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/geometry/Polygon"]);
  const polygon = new Polygon({
    hasM: true,
    hasZ: true,
    rings: geomerty.rings,
    spatialReference: {
      wkid: 4326
    }
  });
  let map = _configs_json__WEBPACK_IMPORTED_MODULE_1__.mapView;

  if (map) {
    addGraghicToMap(map, polygon);
    map.goTo(polygon);
  }
};



/***/ }),

/***/ "./src/plugins/investment-filter.js":
/*!******************************************!*\
  !*** ./src/plugins/investment-filter.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "investmentType_filter": () => /* binding */ investmentType_filter
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ "./src/index.js");
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../configs.json */ "./src/configs.json");


let investment = [{
  "OPPORTUNITYTYPEID": "01",
  "OPPORTUNITYTYPE": "استثمار"
}, {
  "OPPORTUNITYTYPEID": "02",
  "OPPORTUNITYTYPE": "تاجير مؤقت"
}];

const investmentType_filter = () => {
  var parent = document.getElementById("investmentType");
  var selectList = document.createElement("select");
  selectList.id = "investmentTypeSelect";
  selectList.className = "form-control";
  selectList.onchange = _onChange;
  parent.appendChild(selectList);
  let content;

  for (let index = 0; index < investment.length; index++) {
    const element = investment[index];
    content += `<option value="${element.OPPORTUNITYTYPEID}">${element.OPPORTUNITYTYPE}</option>`;
  }

  $(".loadingInvestmentType").remove();
  $("#investmentTypeSelect").append('<option value="1=1">كل أنواع الاستثمار</option>');
  $("#investmentTypeSelect").append(content);
};

const _onChange = event => {
  let currentDate = new Date().toISOString().slice(0, 10);
  let exprssion = `OPPORTUNITYTYPEID='${event.target.value}' AND LASTRFPSELLDATE >= DATE '${currentDate}'`;

  if (event.target.value != '1=1') {
    (0,_index__WEBPACK_IMPORTED_MODULE_0__.setFeatureLayerViewFilter)(_configs_json__WEBPACK_IMPORTED_MODULE_1__.data.investmentFLayer, exprssion);
  } else {
    let currentDate = new Date().toISOString().slice(0, 10);
    let exprssion = `${_configs_json__WEBPACK_IMPORTED_MODULE_1__.layers[0].where} '${currentDate}'`;
    (0,_index__WEBPACK_IMPORTED_MODULE_0__.setFeatureLayerViewFilter)(_configs_json__WEBPACK_IMPORTED_MODULE_1__.data.investmentFLayer, exprssion);
  }
};



/***/ }),

/***/ "./src/plugins/query-layers.js":
/*!*************************************!*\
  !*** ./src/plugins/query-layers.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clickOnFilterButton": () => /* binding */ clickOnFilterButton,
/* harmony export */   "OnStartFilter": () => /* binding */ OnStartFilter,
/* harmony export */   "MapRadioChange": () => /* binding */ MapRadioChange,
/* harmony export */   "addSketchGraphicLayer": () => /* binding */ addSketchGraphicLayer
/* harmony export */ });
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! esri-loader */ "./node_modules/esri-loader/dist/umd/esri-loader.js");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_arc_gis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/arc-gis */ "./src/services/arc-gis.js");
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../configs.json */ "./src/configs.json");



let showHideFilter = true;
let mapExtent = true;
let selectionArea;
let sketchWidget;
let sketchGraphicLayer;

const clickOnFilterButton = function () {
  $('#btnFilter').click(function () {
    $("#mapExtent").attr("checked", true);
    trremove();
    $('#startFilter').html(' <i class="fas fa-search-location"></i> بدء التصفية');
    $('#startFilter').prop("disabled", false);
    $('.spinner').css('display', 'none');
    $('.Grid').css('display', 'none');

    if (showHideFilter) {
      $('#sidebar').css('display', 'block');
      showHideFilter = !showHideFilter;
    } else {
      $('#sidebar').css('display', 'none');
      showHideFilter = !showHideFilter;
    }
  });
};

const MapRadioChange = function () {
  $("#mapExtent").change(function () {
    $("#mapExtent").prop("checked", true);
    $("#selectionArea").prop("checked", false);
    mapExtent = true;
    selectionArea = false;
  });
  $("#selectionArea").change(function () {
    $("#selectionArea").prop("checked", true);
    $("#mapExtent").prop("checked", false);
    $('#InvestmentOpportunities').DataTable().clear().destroy();
    $('.Grid').css('display', 'none');
    mapExtent = false;
    selectionArea = true;
    addSketchTool(sketchGraphicLayer, _configs_json__WEBPACK_IMPORTED_MODULE_2__.mapView, "bottom-right");
  });
};

const OnStartFilter = function (config, extent) {
  $('#startFilter').click(function () {
    $('.spinner').css('display', 'block');
    $(this).prop("disabled", true);
    $(this).html('<i class="fa fa-circle-o-notch fa-spin"></i> جارى التحميل...');

    if (mapExtent == true) {
      sketchGraphicLayer.removeAll();
      config.mapExtentDraw = null;
      getDataOnMapExtent(config, "map");
    } else {
      if (config.mapExtentDraw != null) {
        getDataOnMapExtent(config, "draw");
      } else {
        alert('برجاء رسم نطاق البحث على الخريطة باستخدام ادوات الرسم الموجودة بالاسفل');
        $('.spinner').css('display', 'none');
        $('#startFilter').html(' <i class="fas fa-search-location"></i> بدء التصفية');
        $('#startFilter').prop("disabled", false);
      }
    }
  });
};

const getDataOnMapExtent = function (config, type) {
  let currentDate = new Date().toISOString().slice(0, 10);
  let exprssion = `${config.layers[0].where} '${currentDate}'`;
  (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.queryTaskAsync)({
    url: config.layers[0].url,
    where: exprssion,
    mode: _services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.queryMode.Features,
    returnGeometry: true,
    geometry: type == "map" ? config.mapExtent : config.mapExtentDraw,
    proxy: config.proxy.urlPrefix,
    proxyUrl: config.proxy.proxyUrl
  }).then(res => {
    if (res.features.length > 0) {
      console.log(res);
      let results = res.features.map(item => item.attributes);
      let data = [];

      for (let index = 0; index < results.length; index++) {
        const el = results[index];
        data.push({
          BALADYA: el.BALADYA,
          AMANA: el.AMANA,
          OPPORTUNITYDESCRIPTION: el.OPPORTUNITYDESCRIPTION
        });
      }

      console.log(results);
      console.log(data);
      LoadInvestmentOpportunities(data); // addGraphic(graphicLayer, res.features[0], true);
      //  mapViewGoTo(mapView, res.features[0], 1000, "out-quint", 30000, 1);
    }
  });
};

function LoadInvestmentOpportunities(data) {
  //trremove();
  // for (var i = 0; i < data.length; i++) {
  //     $('#InvestmentOpportunities').append(`<tr><td> ${data[i].BALADYA} </td><td> ${data[i].AMANA} </td><td> ${data[i].OPPORTUNITYDESCRIPTION} </td></tr>`)
  // }
  $("#InvestmentOpportunities tr").css('cursor', 'pointer');
  $('#InvestmentOpportunities').DataTable().clear().destroy();
  $('#InvestmentOpportunities').DataTable({
    dom: 'Bfrtip',
    buttons: [// 'copyHtml5',
    // 'excelHtml5',
    // 'csvHtml5',
    // 'pdfHtml5'
    {
      extend: 'excelHtml5',
      text: 'تصدير اكسيل'
    }],
    "bLengthChange": false,
    "pageLength": 3,
    "bInfo": false,
    "language": {
      "emptyTable": "لا توجد بيانات"
    },
    "oLanguage": {
      "sSearch": "بحث عن فرصة",
      "paginate": {
        "previous": "السابق",
        "next": "التالى"
      }
    },
    data: data,
    columns: [{
      data: "BALADYA"
    }, {
      data: "AMANA"
    }, {
      data: "OPPORTUNITYDESCRIPTION"
    }]
  });
  $('#startFilter').html(' <i class="fas fa-search-location"></i> بدء التصفية');
  $('#startFilter').prop("disabled", false);
  $('.spinner').css('display', 'none');
  $('.Grid').css('display', 'block');
  setDataTableClickEvent();
}

function setDataTableClickEvent() {
  var table = $('#InvestmentOpportunities').DataTable();
  $('#InvestmentOpportunities tbody').on('click', 'tr', function () {
    var rowClicked = table.row(this).data();
    console.log(rowClicked);
  });
}

function trremove() {
  $('#InvestmentOpportunities tr').each(function (i) {
    if (i > 0) {
      $(this).remove();
    }
  });
}

async function addSketchTool(layer, mapView, position) {
  var sketch = document.getElementById('#sketchWidget');
  console.log(sketch);

  if (sketchWidget != null) {
    return;
  }

  const [Sketch] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/widgets/Sketch"]);
  sketchWidget = new Sketch({
    layer: layer,
    view: mapView,
    container: sketch,
    //availableCreateTools: [config.featureServiceType]
    availableCreateTools: ["polygon", "polyline"]
  });
  sketchInfo();
  mapView.ui.add(sketchWidget, position);
}

async function sketchInfo() {
  sketchWidget.on("create", event => {
    if (event.state === "complete") {
      console.log(event);
      _configs_json__WEBPACK_IMPORTED_MODULE_2__.mapExtentDraw = event.graphic.geometry.extent;
    }
  });
}

async function addSketchGraphicLayer(mapView) {
  sketchGraphicLayer = await (0,_services_arc_gis__WEBPACK_IMPORTED_MODULE_1__.addGraphicLayer)("sketch", mapView);
}



/***/ }),

/***/ "./src/plugins/search-plugin.js":
/*!**************************************!*\
  !*** ./src/plugins/search-plugin.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addSearchWidget": () => /* binding */ addSearchWidget
/* harmony export */ });
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! esri-loader */ "./node_modules/esri-loader/dist/umd/esri-loader.js");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../configs.json */ "./src/configs.json");


let sources = [];
let searchWidget;

const dataSource = () => {
  sources.push({
    layer: _configs_json__WEBPACK_IMPORTED_MODULE_1__.data.investmentFLayer,
    searchFields: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].searchFields,
    displayField: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].displayField,
    exactMatch: false,
    outFields: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].outFields,
    name: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].name,
    placeholder: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].placeholder,
    suggestionsEnabled: true
  });
  console.log(sources);
  return sources;
};

const addSearchWidget = async (mapView, position) => {
  const [Search, FeatureLayer] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/widgets/Search", "esri/layers/FeatureLayer"]); // let parent = document.body;
  // let search = document.createElement('div');
  // search.id = "search";
  // parent.appendChild(search);

  let layer = new FeatureLayer({
    url: _configs_json__WEBPACK_IMPORTED_MODULE_1__.layers[0].url
  }); // config.layers[0].url

  searchWidget = new Search({
    view: mapView,
    //  allPlaceholder: this.data.resources.search,
    //   container: document.getElementById("search"),
    includeDefaultSources: false,
    locationEnabled: false,
    sources: [{
      layer: layer,
      searchFields: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].searchFields,
      displayField: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].displayField,
      exactMatch: false,
      outFields: "*",
      name: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].name,
      placeholder: _configs_json__WEBPACK_IMPORTED_MODULE_1__.searchWidget.sources[0].placeholder //suggestionsEnabled: true,

    }]
  });
  mapView.ui.add(searchWidget, {
    position: position
  });
  addSearchCompletedEvent();
};

const addSearchCompletedEvent = () => {
  searchWidget.on("search-complete", function (event) {
    if (event.results[0].results.length > 0) {
      let results = event.results[0].results.map(item => item.feature);
      console.log(results);
    } else {
      alert('لا توجد نتائج للبحث');
    }
  });
};



/***/ }),

/***/ "./src/plugins/test.js":
/*!*****************************!*\
  !*** ./src/plugins/test.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "test": () => /* binding */ test
/* harmony export */ });
/* harmony import */ var _configs_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../configs.json */ "./src/configs.json");

let data = {
  config: _configs_json__WEBPACK_IMPORTED_MODULE_0__
};
let mapView = null;

const test = () => {
  mapView = data.mapView;
  console.log(data.config);
};



/***/ }),

/***/ "./src/services/arc-gis.js":
/*!*********************************!*\
  !*** ./src/services/arc-gis.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addGraphicLayer": () => /* binding */ addGraphicLayer,
/* harmony export */   "queryTaskAsync": () => /* binding */ queryTaskAsync,
/* harmony export */   "queryMode": () => /* binding */ queryMode,
/* harmony export */   "addGraphic": () => /* binding */ addGraphic,
/* harmony export */   "addSketchTool": () => /* binding */ addSketchTool,
/* harmony export */   "mapViewGoTo": () => /* binding */ mapViewGoTo,
/* harmony export */   "checkOnGeometryIsContainsAmana": () => /* binding */ checkOnGeometryIsContainsAmana,
/* harmony export */   "webMercatorToGeographic": () => /* binding */ webMercatorToGeographic,
/* harmony export */   "getFeatureLayer": () => /* binding */ getFeatureLayer,
/* harmony export */   "addFeature": () => /* binding */ addFeature,
/* harmony export */   "caretePoint": () => /* binding */ caretePoint,
/* harmony export */   "deleteFeature": () => /* binding */ deleteFeature,
/* harmony export */   "getPolygonSymbolWithoutOutLine": () => /* binding */ getPolygonSymbolWithoutOutLine,
/* harmony export */   "BasemapToggle": () => /* binding */ BasemapToggle,
/* harmony export */   "fursaViewerImagePointSymbol": () => /* binding */ fursaViewerImagePointSymbol
/* harmony export */ });
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! esri-loader */ "./node_modules/esri-loader/dist/umd/esri-loader.js");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_0__);

let queryMode = {
  Features: "Features",
  ObjectIds: "ObjectIds",
  FeatureCount: "FeatureCount"
};

const queryTaskAsync = async options => {
  const [QueryTask, Query, urlUtils, esriConfig] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/core/urlUtils", "esri/config"]);
  urlUtils.addProxyRule({
    urlPrefix: options.proxy,
    proxyUrl: options.proxyUrl
  }); // esriConfig.request.proxyUrl = "https://furas.momra.gov.sa/JavaProxy/proxy.jsp";

  esriConfig.request.forceProxy = true;
  let queryTask = new QueryTask({
    url: options.url
  });
  let query = new Query();

  if (options.geometry != undefined) {
    query.geometry = options.geometry;
  }

  if (options.spatialRelationship != undefined) {
    query.spatialRelationship = options.spatialRelationship;
  }

  if (options.num != undefined) {
    query.num = options.num;
  }

  if (options.start != undefined) {
    query.start = options.start;
  }

  query.returnGeometry = options.returnGeometry != null ? options.returnGeometry : true;
  query.objectIds = options.objectIds ? options.objectIds : [];
  query.outFields = options.outFields ? options.outFields : ["*"];
  query.where = options.where == "" ? "1=1" : options.where;
  query.orderByFields = options.orderByFields ? options.orderByFields : [];

  switch (options.mode.toLowerCase()) {
    case queryMode.Features.toLowerCase():
      return queryTask.execute(query);

    case queryMode.ObjectIds.toLowerCase():
      return queryTask.executeForIds(query);

    case queryMode.FeatureCount.toLowerCase():
      return queryTask.executeForCount(query);
  }
};

const addGraphicLayer = async (name, mapView) => {
  const [GraphicsLayer] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/layers/GraphicsLayer"]);
  let graphicLayer = getLayer(mapView, name + "graphicLayer");

  if (graphicLayer === undefined) {
    graphicLayer = new GraphicsLayer({
      id: name + "graphicLayer"
    });
    mapView.map.add(graphicLayer);
  }

  return graphicLayer;
};

const addSketchTool = async (layer, view, position, config) => {
  console.log(config.featureServiceType);
  const [Sketch] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/widgets/Sketch"]);
  let sketchWidget = new Sketch({
    layer: layer,
    view: view,
    availableCreateTools: [config.featureServiceType]
  });
  view.ui.add(sketchWidget, position);
};

const getLayer = (mapView, id) => {
  let layer = mapView.map.layers.find(function (l) {
    return l.id === id;
  });
  return layer;
};

const addGraphic = async (layer, feature, clear, layerType = null, hover = null, pinColor = null) => {
  if (clear) {
    layer.removeAll();
  }

  const [Graphic] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/Graphic"]);

  let _geomerty = feature.geometry || feature;

  var graphic = new Graphic({
    geometry: _geomerty,
    attributes: feature.attributes
  });

  switch (_geomerty.type) {
    case "polyline":
      graphic.symbol = getPolylineSymbol();
      break;

    case "polygon":
      graphic.symbol = layerType == null && hover == null ? getPolylineSymbol() : hover != null && layerType == null ? getPolygonSymbolWithoutOutLine() : getPolygonSymbolWithoutOutLine();
      break;

    case "point":
      graphic.symbol = layerType == null && hover == null ? ImagePointSymbol(pinColor) : hover != null && layerType == null ? getHoverImagePointSymbol() : getImagePointSymbol(layerType);
      break;
  }

  layer.add(graphic);
};

let getPolylineSymbol = () => {
  var symbol = {
    type: "simple-line",
    color: "red",
    width: "2px",
    style: "solid"
  };
  return symbol;
};

let getPolygonSymbolWithoutOutLine = () => {
  var stroke = {
    color: "red",
    width: 1
  };
  var fillColor = [94, 90, 90, 0.3];
  var symbol = {
    type: "simple-fill",
    color: fillColor,
    style: "solid",
    outline: {
      color: [94, 90, 90],
      width: 0
    }
  };
  return symbol;
};

let ImagePointSymbol = color => {
  let symbol;
  symbol = {
    type: "picture-marker",
    url: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    width: "20px",
    height: "30px"
  };
  return symbol;
};

let fursaViewerImagePointSymbol = type => {
  let symbol;
  debugger;
  let arr = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "201", "202", "203", "204", "205", "206", "207"];

  switch (type) {
    case "101":
      symbol = {
        type: "picture-marker",
        url: `assets/images/101.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "102":
      symbol = {
        type: "picture-marker",
        url: `assets/images/102.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "103":
      symbol = {
        type: "picture-marker",
        url: `assets/images/103.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "104":
      symbol = {
        type: "picture-marker",
        url: `assets/images/104.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "105":
      symbol = {
        type: "picture-marker",
        url: `assets/images/105.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "106":
      symbol = {
        type: "picture-marker",
        url: `assets/images/106.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "107":
      symbol = {
        type: "picture-marker",
        url: `assets/images/107.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "108":
      symbol = {
        type: "picture-marker",
        url: `assets/images/108.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "109":
      symbol = {
        type: "picture-marker",
        url: `assets/images/109.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "110":
      symbol = {
        type: "picture-marker",
        url: `assets/images/110.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "111":
      symbol = {
        type: "picture-marker",
        url: `assets/images/111.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "112":
      symbol = {
        type: "picture-marker",
        url: `assets/images/112.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "113":
      symbol = {
        type: "picture-marker",
        url: `assets/images/113.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "114":
      symbol = {
        type: "picture-marker",
        url: `assets/images/114.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "115":
      symbol = {
        type: "picture-marker",
        url: `assets/images/115.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "116":
      symbol = {
        type: "picture-marker",
        url: `assets/images/116.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    case "117":
      symbol = {
        type: "picture-marker",
        url: `assets/images/117.png`,
        width: "20px",
        height: "30px"
      };
      return symbol;

    default:
      symbol = {
        type: "picture-marker",
        url: 'assets/images/default.png',
        width: "20px",
        height: "30px"
      };
      return symbol;
  }
};

let getHoverImagePointSymbol = () => {
  let symbol;
  symbol = {
    type: "picture-marker",
    url: "assets/images/icons/map/40/spotlight.png",
    width: "50px",
    height: "50px"
  };
  return symbol;
};

let getImagePointSymbol = layerType => {};

const mapViewGoTo = (mapView, feature, duration = 1000, easing = "out-quint", scale = 5000, expand = 1) => {
  let options = {
    duration: duration,
    // speedFactor: 0.6, // animation is 10 times slower than default
    easing: easing // easing function to slow down when reaching the target

  };

  if (feature.geometry.type == 'point') {
    mapView.goTo({
      target: feature,
      scale: scale
    }, options);
  } else {
    if (feature.geometry.extent) {
      mapView.goTo({
        target: feature.geometry.extent.expand(expand)
      }, options);
    }
  }
};

const checkOnGeometryIsContainsAmana = async (containerGeometry, insideGeometry) => {
  const [geometryEngine] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/geometry/geometryEngine"]);
  return geometryEngine.contains(containerGeometry, insideGeometry);
};

const webMercatorToGeographic = async geometry => {
  const [webMercatorUtils] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/geometry/support/webMercatorUtils"]); // let check = geometry.spatialReference.isWebMercator == true;
  // if (check) {

  return webMercatorUtils.webMercatorToGeographic(geometry); //}

  return -1;
};

const getFeatureLayer = async (layerURL, renderer) => {
  const [FeatureLayer] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/layers/FeatureLayer"]);
  let featureLayer = new FeatureLayer({
    url: layerURL,
    renderer: renderer,
    outFields: ["*"]
  });
  return featureLayer;
};

const addFeature = (feature, featurelayer, successCallback, errorCallback) => {
  const add = {
    addFeatures: [feature]
  };
  featurelayer.applyEdits(add).then(function (results) {
    if (results.addFeatureResults.length > 0) {
      successCallback(results.addFeatureResults[0]);
    } else {
      errorCallback();
    }
  }).catch(error => {
    errorCallback(error);
  });
};

const caretePoint = (x, y, spatialReference = 4326) => {
  let point = {
    type: "point",
    x: x,
    y: y,
    spatialReference: spatialReference
  };
  return point;
};

const deleteFeature = (objectId, featurelayer, successCallback, errorCallback) => {
  const feature = {
    objectId: objectId
  };
  const deleteFeature = {
    deleteFeatures: [feature]
  };
  featurelayer.applyEdits(deleteFeature).then(function (results) {
    if (results.deleteFeatureResults.length > 0) {
      successCallback(results.deleteFeatureResults[0]);
    } else {
      errorCallback();
    }
  }).catch(error => {
    errorCallback(error);
  });
};

const BasemapToggle = async (mapView, position) => {
  const [BasemapToggle] = await (0,esri_loader__WEBPACK_IMPORTED_MODULE_0__.loadModules)(["esri/widgets/BasemapToggle"]);
  var toggle = new BasemapToggle({
    view: mapView,
    nextBasemap: "satellite"
  });
  mapView.ui.add(toggle, position);
};



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles.scss":
/*!******************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles.scss ***!
  \******************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://js.arcgis.com/4.18/esri/themes/light/main.css);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://cdn.datatables.net/1.10.23/css/dataTables.bootstrap4.min.css);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body, html {\n  height: 100%;\n  width: 100%;\n}\n\n.map {\n  height: 94%;\n}\n\n.bg-light {\n  background-color: #007473 !important;\n}\n\n.navbar-light .navbar-brand {\n  color: rgba(251, 251, 251, 0.9);\n}\n\nselect.form-control {\n  width: 180px;\n  margin: 0 5px;\n}\n\ndiv#navbarSupportedContent {\n  margin-left: 25%;\n  direction: rtl;\n  margin-right: 25%;\n}\n\n::-webkit-scrollbar {\n  width: 4px;\n  overflow-y: scroll;\n  background: grey;\n  box-shadow: inset 0 0 4px #050505;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #0cb88d;\n  border-radius: 5px;\n}\n\n.esri-search {\n  width: 370px;\n}\n\n.esri-search__container {\n  width: 370px;\n}\n\n.esri-search__input {\n  text-align: right;\n}\n\n.esri-search--show-suggestions .esri-search__suggestions-menu, .esri-search--sources .esri-search__sources-menu {\n  text-align: right;\n}\n\nbutton#btnFilter {\n  position: absolute;\n  top: 65px;\n  left: 78px;\n  background-color: #414741;\n  padding: 10px;\n  border-radius: 9px;\n  color: #fff;\n}\n\nbutton:active {\n  outline: 0;\n}\n\ndiv#sidebar {\n  position: absolute;\n  width: 474px;\n  top: 113px;\n  left: 78px;\n}\n\nh5.card-title {\n  text-align: center;\n}\n\n.card-containt {\n  display: flex;\n  direction: rtl;\n}\n\n.card-containt-item {\n  display: flex;\n  flex-flow: column;\n  margin-left: 130px;\n}\n\nbutton#startFilter {\n  background: #6bc048;\n  border-radius: 15px;\n  padding: 7px;\n  width: 167px;\n  margin-left: -157px;\n  align-items: fl;\n  margin-top: 10px;\n  color: #fff;\n}\n\n/* Loading animation three dots */\n.spinner {\n  width: 100%;\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  padding-top: 12px;\n}\n\n/* For result list after Enter */\n.spinner > div {\n  width: 15px;\n  height: 15px;\n  background-color: #d2c823;\n  border-radius: 100%;\n  display: inline-block;\n  animation: sk-bouncedelay 1.4s infinite ease-in-out both;\n  margin: 0 2px;\n}\n\n.spinner .bounce1 {\n  -webkit-animation-delay: -0.32s;\n  animation-delay: -0.32s;\n  background: #85BD48;\n}\n\n.spinner .bounce2 {\n  -webkit-animation-delay: -0.16s;\n  animation-delay: -0.16s;\n  background: #07706D;\n}\n\n@-webkit-keyframes sk-bouncedelay {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n  }\n  40% {\n    -webkit-transform: scale(1);\n  }\n}\n@keyframes sk-bouncedelay {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n    transform: scale(0);\n  }\n  40% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n  }\n}\n.Grid {\n  display: none;\n}\n\ndiv.dataTables_wrapper div.dataTables_filter input {\n  margin-left: 2.5em;\n  float: left;\n  margin-right: 0.5em;\n}\n\ndiv.dataTables_wrapper div.dataTables_filter label {\n  text-align: right;\n}\n\nbutton.dt-button.buttons-excel.buttons-html5 {\n  background-color: #414741;\n  color: white;\n  border-radius: 10px;\n  width: 104px;\n}\n\ndiv.dataTables_wrapper div.dataTables_paginate ul.pagination {\n  justify-content: flex-start;\n  direction: rtl;\n}\n\n.page-item.active .page-link {\n  background-color: #4e5154;\n  border-color: #222427;\n}\n\n.page-link {\n  color: #4e5154;\n}\n\n.page-link:hover {\n  color: #4e5154;\n}", "",{"version":3,"sources":["webpack://./src/styles.scss"],"names":[],"mappings":"AAIA;EACI,YAAA;EACA,WAAA;AAAJ;;AAGA;EACI,WAAA;AAAJ;;AAGA;EACE,oCAAA;AAAF;;AAIA;EACE,+BAAA;AADF;;AAIA;EACE,YAAA;EACA,aAAA;AADF;;AAIA;EACE,gBAAA;EACA,cAAA;EACA,iBAAA;AADF;;AAIA;EACE,UAAA;EACA,kBAAA;EACA,gBAAA;EACA,iCAAA;AADF;;AAIA;EACE,mBAAA;EACA,kBAAA;AADF;;AAIA;EACE,YAAA;AADF;;AAGA;EACE,YAAA;AAAF;;AAGA;EACE,iBAAA;AAAF;;AAGA;EACE,iBAAA;AAAF;;AAGA;EACE,kBAAA;EACA,SAAA;EACA,UAAA;EACA,yBAAA;EACA,aAAA;EACA,kBAAA;EACA,WAAA;AAAF;;AAGA;EAAe,UAAA;AACf;;AACA;EACE,kBAAA;EACA,YAAA;EACA,UAAA;EACA,UAAA;AAEF;;AACA;EACE,kBAAA;AAEF;;AACA;EACE,aAAA;EACA,cAAA;AAEF;;AACA;EACE,aAAA;EACA,iBAAA;EACA,kBAAA;AAEF;;AACA;EACE,mBAAA;EACA,mBAAA;EACA,YAAA;EACA,YAAA;EACA,mBAAA;EACA,eAAA;EACA,gBAAA;EACC,WAAA;AAEH;;AACA,iCAAA;AACA;EACE,WAAA;EACA,kBAAA;EAMA,aAAA;EACA,uBAAA;EACA,iBAAA;AAHF;;AAKA,gCAAA;AAUA;EACE,WAAA;EACA,YAAA;EACA,yBAAA;EACA,mBAAA;EACA,qBAAA;EACA,wDAAA;EACA,aAAA;AAXF;;AAgBA;EACE,+BAAA;EACA,uBAAA;EACA,mBAAA;AAbF;;AAkBA;EACE,+BAAA;EACA,uBAAA;EACA,mBAAA;AAfF;;AAoBA;EACE;IAAgB,2BAAA;EAhBhB;EAiBA;IAAM,2BAAA;EAdN;AACF;AAkBA;EACE;IACE,2BAAA;IACA,mBAAA;EAhBF;EAiBE;IACA,2BAAA;IACA,mBAAA;EAfF;AACF;AAkBA;EACE,aAAA;AAhBF;;AAmBA;EACE,kBAAA;EACA,WAAA;EACA,mBAAA;AAhBF;;AAkBA;EACE,iBAAA;AAfF;;AAkBA;EACE,yBAAA;EACA,YAAA;EACA,mBAAA;EACA,YAAA;AAfF;;AAkBA;EACE,2BAAA;EACA,cAAA;AAfF;;AAkBA;EACE,yBAAA;EACA,qBAAA;AAfF;;AAkBA;EACE,cAAA;AAfF;;AAkBA;EACE,cAAA;AAfF","sourcesContent":["@import url(\"https://js.arcgis.com/4.18/esri/themes/light/main.css\");\r\n@import url(\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css\");\r\n@import url(\"https://cdn.datatables.net/1.10.23/css/dataTables.bootstrap4.min.css\");\r\n\r\nbody, html {\r\n    height: 100%;\r\n    width: 100%;\r\n  }\r\n\r\n.map {\r\n    height: 94%;\r\n}\r\n\r\n.bg-light {\r\n  background-color: #007473!important;\r\n}\r\n\r\n\r\n.navbar-light .navbar-brand {\r\n  color: rgb(251 251 251 / 90%);\r\n}\r\n\r\nselect.form-control {\r\n  width: 180px;\r\n  margin: 0 5px;\r\n}\r\n\r\ndiv#navbarSupportedContent {\r\n  margin-left: 25%;\r\n  direction: rtl;\r\n  margin-right: 25%;\r\n}\r\n\r\n::-webkit-scrollbar {\r\n  width: 4px;\r\n  overflow-y: scroll;\r\n  background: grey;\r\n  box-shadow: inset 0 0 4px #050505;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n  background: #0cb88d;\r\n  border-radius: 5px;\r\n}\r\n\r\n.esri-search {\r\n  width: 370px;\r\n}\r\n.esri-search__container{\r\n  width: 370px;\r\n}\r\n\r\n.esri-search__input{\r\n  text-align: right;\r\n}\r\n\r\n.esri-search--show-suggestions .esri-search__suggestions-menu, .esri-search--sources .esri-search__sources-menu{\r\n  text-align: right;\r\n}\r\n\r\nbutton#btnFilter {\r\n  position: absolute;\r\n  top: 65px;\r\n  left: 78px;\r\n  background-color: #414741;\r\n  padding: 10px;\r\n  border-radius: 9px;\r\n  color: #fff;\r\n}\r\n\r\nbutton:active {outline:0;}\r\n\r\ndiv#sidebar {\r\n  position: absolute;\r\n  width: 474px;\r\n  top: 113px;\r\n  left: 78px;\r\n}\r\n\r\nh5.card-title {\r\n  text-align: center;\r\n}\r\n\r\n.card-containt {\r\n  display: flex;\r\n  direction: rtl;\r\n}\r\n\r\n.card-containt-item {\r\n  display: flex;\r\n  flex-flow: column;\r\n  margin-left: 130px;\r\n}\r\n\r\nbutton#startFilter {\r\n  background: #6bc048;\r\n  border-radius: 15px;\r\n  padding: 7px;\r\n  width: 167px;\r\n  margin-left: -157px;\r\n  align-items: fl;\r\n  margin-top: 10px;\r\n   color: #fff;\r\n}\r\n\r\n/* Loading animation three dots */\r\n.spinner {\r\n  width: 100%;\r\n  text-align: center;\r\n  //position: absolute;\r\n  // left: 12px;\r\n  // top: 11px;\r\n  // background: white;\r\n  // height: 30px;\r\n  display: flex;\r\n  justify-content: center;\r\n  padding-top: 12px;\r\n}\r\n/* For result list after Enter */\r\n// .spinner.result-list {\r\n//   top: -80px;\r\n//   left: 20px;\r\n//   right: unset;\r\n//   bottom: unset;\r\n//   height: 30px;\r\n// }\r\n \r\n\r\n.spinner > div {\r\n  width: 15px;\r\n  height: 15px;\r\n  background-color: #d2c823;\r\n  border-radius: 100%;\r\n  display: inline-block;\r\n  animation: sk-bouncedelay 1.4s infinite ease-in-out both;\r\n  margin: 0 2px;\r\n}\r\n\r\n \r\n\r\n.spinner .bounce1 {\r\n  -webkit-animation-delay: -0.32s;\r\n  animation-delay: -0.32s;\r\n  background:#85BD48;\r\n}\r\n\r\n \r\n\r\n.spinner .bounce2 {\r\n  -webkit-animation-delay: -0.16s;\r\n  animation-delay: -0.16s;\r\n  background:#07706D;\r\n}\r\n\r\n \r\n\r\n@-webkit-keyframes sk-bouncedelay {\r\n  0%, 80%, 100% { -webkit-transform: scale(0) }\r\n  40% { -webkit-transform: scale(1.0) }\r\n}\r\n\r\n \r\n\r\n@keyframes sk-bouncedelay {\r\n  0%, 80%, 100% { \r\n    -webkit-transform: scale(0);\r\n    transform: scale(0);\r\n  } 40% { \r\n    -webkit-transform: scale(1.0);\r\n    transform: scale(1.0);\r\n  }\r\n}\r\n\r\n.Grid{\r\n  display: none;\r\n}\r\n\r\ndiv.dataTables_wrapper div.dataTables_filter input {\r\n  margin-left: 2.5em;\r\n  float: left;\r\n  margin-right: 0.5em;\r\n}\r\ndiv.dataTables_wrapper div.dataTables_filter label{\r\n  text-align: right;\r\n}\r\n\r\nbutton.dt-button.buttons-excel.buttons-html5 {\r\n  background-color: #414741;\r\n  color: white;\r\n  border-radius: 10px;\r\n  width: 104px;\r\n}\r\n\r\ndiv.dataTables_wrapper div.dataTables_paginate ul.pagination{\r\n  justify-content: flex-start;\r\n  direction: rtl;\r\n}\r\n\r\n.page-item.active .page-link {\r\n  background-color: #4e5154;\r\n  border-color: #222427;\r\n}\r\n\r\n.page-link{\r\n  color: #4e5154;\r\n}\r\n\r\n.page-link:hover{\r\n  color: #4e5154;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === 'function') {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
};

/***/ }),

/***/ "./node_modules/esri-loader/dist/umd/esri-loader.js":
/*!**********************************************************!*\
  !*** ./node_modules/esri-loader/dist/umd/esri-loader.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
	 true ? factory(exports) :
	0;
}(this, (function (exports) { 'use strict';

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
var isBrowser = typeof window !== 'undefined';
// allow consuming libraries to provide their own Promise implementations
var utils = {
    Promise: isBrowser ? window['Promise'] : undefined
};

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
var DEFAULT_VERSION = '4.18';
var NEXT = 'next';
function parseVersion(version) {
    if (version.toLowerCase() === NEXT) {
        return NEXT;
    }
    var match = version && version.match(/^(\d)\.(\d+)/);
    return match && {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10)
    };
}
/**
 * Get the CDN url for a given version
 *
 * @param version Ex: '4.18' or '3.35'. Defaults to the latest 4.x version.
 */
function getCdnUrl(version) {
    if (version === void 0) { version = DEFAULT_VERSION; }
    return "https://js.arcgis.com/" + version + "/";
}
/**
 * Get the CDN url for a the CSS for a given version and/or theme
 *
 * @param version Ex: '4.18', '3.35', or 'next'. Defaults to the latest 4.x version.
 */
function getCdnCssUrl(version) {
    if (version === void 0) { version = DEFAULT_VERSION; }
    var baseUrl = getCdnUrl(version);
    var parsedVersion = parseVersion(version);
    if (parsedVersion !== NEXT && parsedVersion.major === 3) {
        // NOTE: at 3.11 the CSS moved from the /js folder to the root
        var path = parsedVersion.minor <= 10 ? 'js/' : '';
        return "" + baseUrl + path + "esri/css/esri.css";
    }
    else {
        // assume 4.x
        return baseUrl + "esri/themes/light/main.css";
    }
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
function createStylesheetLink(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    return link;
}
function insertLink(link, before) {
    if (before) {
        // the link should be inserted before a specific node
        var beforeNode = document.querySelector(before);
        beforeNode.parentNode.insertBefore(link, beforeNode);
    }
    else {
        // append the link to then end of the head tag
        document.head.appendChild(link);
    }
}
// check if the css url has been injected or added manually
function getCss(url) {
    return document.querySelector("link[href*=\"" + url + "\"]");
}
function getCssUrl(urlOrVersion) {
    return !urlOrVersion || parseVersion(urlOrVersion)
        // if it's a valid version string return the CDN URL
        ? getCdnCssUrl(urlOrVersion)
        // otherwise assume it's a URL and return that
        : urlOrVersion;
}
// lazy load the CSS needed for the ArcGIS API
function loadCss(urlOrVersion, before) {
    var url = getCssUrl(urlOrVersion);
    var link = getCss(url);
    if (!link) {
        // create & load the css link
        link = createStylesheetLink(url);
        insertLink(link, before);
    }
    return link;
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
var defaultOptions = {};
function createScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.setAttribute('data-esri-loader', 'loading');
    return script;
}
// add a one-time load handler to script
// and optionally add a one time error handler as well
function handleScriptLoad(script, callback, errback) {
    var onScriptError;
    if (errback) {
        // set up an error handler as well
        onScriptError = handleScriptError(script, errback);
    }
    var onScriptLoad = function () {
        // pass the script to the callback
        callback(script);
        // remove this event listener
        script.removeEventListener('load', onScriptLoad, false);
        if (onScriptError) {
            // remove the error listener as well
            script.removeEventListener('error', onScriptError, false);
        }
    };
    script.addEventListener('load', onScriptLoad, false);
}
// add a one-time error handler to the script
function handleScriptError(script, callback) {
    var onScriptError = function (e) {
        // reject the promise and remove this event listener
        callback(e.error || new Error("There was an error attempting to load " + script.src));
        // remove this event listener
        script.removeEventListener('error', onScriptError, false);
    };
    script.addEventListener('error', onScriptError, false);
    return onScriptError;
}
// allow the user to configure default script options rather than passing options to `loadModules` each time
function setDefaultOptions(options) {
    if (options === void 0) { options = {}; }
    defaultOptions = options;
}
// get the script injected by this library
function getScript() {
    return document.querySelector('script[data-esri-loader]');
}
// has ArcGIS API been loaded on the page yet?
function isLoaded() {
    var globalRequire = window['require'];
    // .on() ensures that it's Dojo's AMD loader
    return globalRequire && globalRequire.on;
}
// load the ArcGIS API on the page
function loadScript(options) {
    if (options === void 0) { options = {}; }
    // we would have liked to use spread like { ...defaultOptions, ...options }
    // but TS would inject a polyfill that would require use to configure rollup w content: 'window'
    // if we have another occasion to use spread, let's do that and replace this for...in
    var opts = {};
    [defaultOptions, options].forEach(function (obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                opts[prop] = obj[prop];
            }
        }
    });
    // URL to load
    var version = opts.version;
    var url = opts.url || getCdnUrl(version);
    return new utils.Promise(function (resolve, reject) {
        var script = getScript();
        if (script) {
            // the API is already loaded or in the process of loading...
            // NOTE: have to test against scr attribute value, not script.src
            // b/c the latter will return the full url for relative paths
            var src = script.getAttribute('src');
            if (src !== url) {
                // potentially trying to load a different version of the API
                reject(new Error("The ArcGIS API for JavaScript is already loaded (" + src + ")."));
            }
            else {
                if (isLoaded()) {
                    // the script has already successfully loaded
                    resolve(script);
                }
                else {
                    // wait for the script to load and then resolve
                    handleScriptLoad(script, resolve, reject);
                }
            }
        }
        else {
            if (isLoaded()) {
                // the API has been loaded by some other means
                // potentially trying to load a different version of the API
                reject(new Error("The ArcGIS API for JavaScript is already loaded."));
            }
            else {
                // this is the first time attempting to load the API
                var css = opts.css;
                if (css) {
                    var useVersion = css === true;
                    // load the css before loading the script
                    loadCss(useVersion ? version : css, opts.insertCssBefore);
                }
                // create a script object whose source points to the API
                script = createScript(url);
                // _currentUrl = url;
                // once the script is loaded...
                handleScriptLoad(script, function () {
                    // update the status of the script
                    script.setAttribute('data-esri-loader', 'loaded');
                    // return the script
                    resolve(script);
                }, reject);
                // load the script
                document.body.appendChild(script);
            }
        }
    });
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
// wrap Dojo's require() in a promise
function requireModules(modules) {
    return new utils.Promise(function (resolve, reject) {
        // If something goes wrong loading the esri/dojo scripts, reject with the error.
        var errorHandler = window['require'].on('error', reject);
        window['require'](modules, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // remove error handler
            errorHandler.remove();
            // Resolve with the parameters from dojo require as an array.
            resolve(args);
        });
    });
}
// returns a promise that resolves with an array of the required modules
// also will attempt to lazy load the ArcGIS API if it has not already been loaded
function loadModules(modules, loadScriptOptions) {
    if (loadScriptOptions === void 0) { loadScriptOptions = {}; }
    if (!isLoaded()) {
        // script is not yet loaded, is it in the process of loading?
        var script = getScript();
        var src = script && script.getAttribute('src');
        if (!loadScriptOptions.url && src) {
            // script is still loading and user did not specify a URL
            // in this case we want to default to the URL that's being loaded
            // instead of defaulting to the latest 4.x URL
            loadScriptOptions.url = src;
        }
        // attempt to load the script then load the modules
        return loadScript(loadScriptOptions).then(function () { return requireModules(modules); });
    }
    else {
        // script is already loaded, just load the modules
        return requireModules(modules);
    }
}

/*
  Copyright (c) 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
// re-export the functions that are part of the public API

exports.utils = utils;
exports.loadModules = loadModules;
exports.getScript = getScript;
exports.isLoaded = isLoaded;
exports.loadScript = loadScript;
exports.setDefaultOptions = setDefaultOptions;
exports.loadCss = loadCss;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=esri-loader.js.map


/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./styles.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/styles.scss");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./src/configs.json":
/*!**************************!*\
  !*** ./src/configs.json ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"layers\":[{\"id\":\"InvestmentP\",\"proxyUrl\":\"http://localhost/fursaProxy/proxy.ashx\",\"proxy\":\"https://gisserver.momra.gov.sa\",\"url\":\"https://gisserver.momra.gov.sa/arcgis/rest/services/GISProjects/InvestmentStg/FeatureServer/0\",\"where\":\"LASTRFPSELLDATE >= DATE \"}],\"municipalityFilter\":{\"AmanaServiceURL\":\"https://furas.momra.gov.sa/JavaProxy/proxy.jsp?https://gisserver.momra.gov.sa:6443/arcgis/rest/services/data_sharing/AdministrativeBoundaryNonBaldy/MapServer/2/query?f=json&where=1=1&returnGeometry=true&outFields=OBJECTID,AMANACODE,AMANAARNAME\",\"BaladyaServiceURL\":\"http://furas.momra.gov.sa/JavaProxy/proxy.jsp?https://gisserver.momra.gov.sa:6443/arcgis/rest/services/data_sharing/AdministrativeBoundaryNonBaldy/MapServer/1/query?f=json&where=1=1&returnGeometry=true&outFields=OBJECTID,AMANACODE,AMANA,MUNICIPALITYCODE,MUNICIPALITYARNAME\"},\"API\":{\"activityAPI\":\"https://furas.momra.gov.sa/prweb/PRRestService/PubAPI/v1/data/D_MainActivityList\"},\"proxy\":{\"urlPrefix\":\"https://gisserver.momra.gov.sa\",\"proxyUrl\":\"http://localhost/fursaProxy/proxy.ashx\"},\"mapView\":null,\"amana\":null,\"municipalities\":null,\"mapExtent\":null,\"mapExtentDraw\":null,\"data\":{\"investmentFLayer\":null},\"searchWidget\":{\"sources\":[{\"searchFields\":[\"OPPORTUNITYDESCRIPTION\"],\"displayField\":\"OPPORTUNITYDESCRIPTION\",\"exactMatch\":false,\"outFields\":[\"OPPORTUNITYDESCRIPTION\"],\"name\":\"InvestmentP\",\"placeholder\":\"البحث\"}]},\"plugins\":{\"query-layers\":{\"col1\":{\"Id\":\"Amana\",\"label\":\"الامانة\"}}}}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.js");
/******/ })()
;
//# sourceMappingURL=invOp.js.map