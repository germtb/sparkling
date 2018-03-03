'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var child_process = require('child_process');
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var atom$1 = require('atom');

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

var emptyObject_1 = emptyObject;

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

var q="function"===typeof Symbol&&Symbol["for"]; var r=q?Symbol["for"]("react.element"):60103; var t=q?Symbol["for"]("react.call"):60104; var u=q?Symbol["for"]("react.return"):60105; var v=q?Symbol["for"]("react.portal"):60106; var w=q?Symbol["for"]("react.fragment"):60107; var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){for(var b=arguments.length-1,e="Minified React error #"+a+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant\x3d"+a,c=0;c<b;c++)e+="\x26args[]\x3d"+encodeURIComponent(arguments[c+1]);b=Error(e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");b.name="Invariant Violation";b.framesToPop=1;throw b;}
var z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function A(a,b,e){this.props=a;this.context=b;this.refs=emptyObject_1;this.updater=e||z;}A.prototype.isReactComponent={};A.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?y("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState");};A.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};
function B(a,b,e){this.props=a;this.context=b;this.refs=emptyObject_1;this.updater=e||z;}function C(){}C.prototype=A.prototype;var D=B.prototype=new C;D.constructor=B;objectAssign(D,A.prototype);D.isPureReactComponent=!0;function E(a,b,e){this.props=a;this.context=b;this.refs=emptyObject_1;this.updater=e||z;}var F=E.prototype=new C;F.constructor=E;objectAssign(F,A.prototype);F.unstable_isAsyncReactComponent=!0;F.render=function(){return this.props.children};var G={current:null}; var H=Object.prototype.hasOwnProperty; var I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,e){var c,d={},g=null,k=null;if(null!=b)for(c in void 0!==b.ref&&(k=b.ref), void 0!==b.key&&(g=""+b.key), b)H.call(b,c)&&!I.hasOwnProperty(c)&&(d[c]=b[c]);var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){for(var h=Array(f),l=0;l<f;l++)h[l]=arguments[l+2];d.children=h;}if(a&&a.defaultProps)for(c in f=a.defaultProps, f)void 0===d[c]&&(d[c]=f[c]);return{$$typeof:r,type:a,key:g,ref:k,props:d,_owner:G.current}}function K(a){return"object"===typeof a&&null!==a&&a.$$typeof===r}
function escape(a){var b={"\x3d":"\x3d0",":":"\x3d2"};return"$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var L=/\/+/g; var M=[];function N(a,b,e,c){if(M.length){var d=M.pop();d.result=a;d.keyPrefix=b;d.func=e;d.context=c;d.count=0;return d}return{result:a,keyPrefix:b,func:e,context:c,count:0}}function O(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>M.length&&M.push(a);}
function P(a,b,e,c){var d=typeof a;if("undefined"===d||"boolean"===d)a=null;var g=!1;if(null===a)g=!0;else switch(d){case "string":case "number":g=!0;break;case "object":switch(a.$$typeof){case r:case t:case u:case v:g=!0;}}if(g)return e(c,a,""===b?"."+Q(a,0):b), 1;g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var k=0;k<a.length;k++){d=a[k];var f=b+Q(d,k);g+=P(d,f,e,c);}else if(null===a||"undefined"===typeof a?f=null:(f=x&&a[x]||a["@@iterator"], f="function"===typeof f?f:null), "function"===typeof f)for(a=
f.call(a), k=0;!(d=a.next()).done;)d=d.value, f=b+Q(d,k++), g+=P(d,f,e,c);else"object"===d&&(e=""+a, y("31","[object Object]"===e?"object with keys {"+Object.keys(a).join(", ")+"}":e,""));return g}function Q(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function R(a,b){a.func.call(a.context,b,a.count++);}
function S(a,b,e){var c=a.result,d=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?T(a,c,e,emptyFunction_1.thatReturnsArgument):null!=a&&(K(a)&&(b=d+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(L,"$\x26/")+"/")+e, a={$$typeof:r,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}), c.push(a));}function T(a,b,e,c,d){var g="";null!=e&&(g=(""+e).replace(L,"$\x26/")+"/");b=N(b,g,c,d);null==a||P(a,"",S,b);O(b);}
var U={Children:{map:function(a,b,e){if(null==a)return a;var c=[];T(a,c,null,b,e);return c},forEach:function(a,b,e){if(null==a)return a;b=N(null,null,b,e);null==a||P(a,"",R,b);O(b);},count:function(a){return null==a?0:P(a,"",emptyFunction_1.thatReturnsNull,null)},toArray:function(a){var b=[];T(a,b,null,emptyFunction_1.thatReturnsArgument);return b},only:function(a){K(a)?void 0:y("143");return a}},Component:A,PureComponent:B,unstable_AsyncComponent:E,Fragment:w,createElement:J,cloneElement:function(a,b,e){var c=objectAssign({},a.props),
d=a.key,g=a.ref,k=a._owner;if(null!=b){void 0!==b.ref&&(g=b.ref, k=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var f=a.type.defaultProps;for(h in b)H.call(b,h)&&!I.hasOwnProperty(h)&&(c[h]=void 0===b[h]&&void 0!==f?f[h]:b[h]);}var h=arguments.length-2;if(1===h)c.children=e;else if(1<h){f=Array(h);for(var l=0;l<h;l++)f[l]=arguments[l+2];c.children=f;}return{$$typeof:r,type:a.type,key:d,ref:g,props:c,_owner:k}},createFactory:function(a){var b=J.bind(null,a);b.type=a;return b},
isValidElement:K,version:"16.2.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:G,assign:objectAssign}};
var V=Object.freeze({default:U});
var W=V&&U||V;var react_production_min=W["default"]?W["default"]:W;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

var warning = emptyFunction_1;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

if (process.env.NODE_ENV !== 'production') {
  var invariant$2 = invariant_1;
  var warning$2 = warning_1;
  var ReactPropTypesSecret$2 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant$2(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$2);
        } catch (ex) {
          error = ex;
        }
        warning$2(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning$2(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes;

var react_development = createCommonjsModule(function (module) {
/** @license React v16.2.0
 * react.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== "production") {
  (function() {
var _assign = objectAssign;
var emptyObject = emptyObject_1;
var invariant = invariant_1;
var warning = warning_1;
var emptyFunction = emptyFunction_1;
var checkPropTypes = checkPropTypes_1;

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.2.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable === 'undefined') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var constructor = publicInstance.constructor;
    var componentName = constructor && (constructor.displayName || constructor.name) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function PureComponent(props, context, updater) {
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

function AsyncComponent(props, context, updater) {
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

var asyncComponentPrototype = AsyncComponent.prototype = new ComponentDummy();
asyncComponentPrototype.constructor = AsyncComponent;
// Avoid an extra prototype jump for these methods.
_assign(asyncComponentPrototype, Component.prototype);
asyncComponentPrototype.unstable_isAsyncReactComponent = true;
asyncComponentPrototype.render = function () {
  return this.props.children;
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown;
var specialPropRefWarningShown;

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */


function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
}

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
function cloneElement(element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var ReactDebugCurrentFrame = {};

{
  // Component that is being worked on
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      return impl();
    }
    return null;
  };
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_CALL_TYPE:
          case REACT_RETURN_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', ReactDebugCurrentFrame.getStackAddendum());
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

var describeComponentFrame = function (name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
};

function getComponentName(fiber) {
  var type = fiber.type;

  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    return type.displayName || type.name;
  }
  return null;
}

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

{
  var currentlyValidatingElement = null;

  var propTypesMisspellWarningShown = false;

  var getDisplayName = function (element) {
    if (element == null) {
      return '#empty';
    } else if (typeof element === 'string' || typeof element === 'number') {
      return '#text';
    } else if (typeof element.type === 'string') {
      return element.type;
    } else if (element.type === REACT_FRAGMENT_TYPE) {
      return 'React.Fragment';
    } else {
      return element.type.displayName || element.type.name || 'Unknown';
    }
  };

  var getStackAddendum = function () {
    var stack = '';
    if (currentlyValidatingElement) {
      var name = getDisplayName(currentlyValidatingElement);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
    }
    stack += ReactDebugCurrentFrame.getStackAddendum() || '';
    return stack;
  };

  var VALID_FRAGMENT_PROPS = new Map([['children', true], ['key', true]]);
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
  }

  currentlyValidatingElement = element;
  {
    warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum());
  }
  currentlyValidatingElement = null;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  var propTypes = componentClass.propTypes;
  if (propTypes) {
    currentlyValidatingElement = element;
    checkPropTypes(propTypes, element.props, 'prop', name, getStackAddendum);
    currentlyValidatingElement = null;
  } else if (componentClass.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warning(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
function validateFragmentProps(fragment) {
  currentlyValidatingElement = fragment;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(fragment.props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (!VALID_FRAGMENT_PROPS.has(key)) {
        warning(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.%s', key, getStackAddendum());
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (fragment.ref !== null) {
    warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.%s', getStackAddendum());
  }

  currentlyValidatingElement = null;
}

function createElementWithValidation(type, props, children) {
  var validType = typeof type === 'string' || typeof type === 'function' || typeof type === 'symbol' || typeof type === 'number';
  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    info += getStackAddendum() || '';

    warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info);
  }

  var element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (typeof type === 'symbol' && type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  // Legacy hook TODO: Warn if this is accessed
  validatedFactory.type = type;

  {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}

function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);
  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}

var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  Component: Component,
  PureComponent: PureComponent,
  unstable_AsyncComponent: AsyncComponent,

  Fragment: REACT_FRAGMENT_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  }
};

{
  _assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3['default'] ? React$3['default'] : React$3;

module.exports = react;
  })();
}
});

var react = createCommonjsModule(function (module) {
if (process.env.NODE_ENV === 'production') {
  module.exports = react_production_min;
} else {
  module.exports = react_development;
}
});

var react_1 = react.Children;
var react_2 = react.PureComponent;
var react_3 = react.Component;
var react_4 = react.createElement;

var DEFAULT_SLICE_LENGTH = 12;

var classnames = createCommonjsModule(function (module) {
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ('object' !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
		// register as 'classnames', consistent with npm package name
		undefined('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());
});

var fuzzysort = createCommonjsModule(function (module) {
/*
WHAT: SublimeText-like Fuzzy Search

USAGE:
  require('fuzzysort').single('fs', 'Fuzzy Search')
  // {score: -16}

  require('fuzzysort').single('test', 'test')
  // {score: 0}

  require('fuzzysort').single('doesnt exist', 'target')
  // null
*/

// UMD (Universal Module Definition) for fuzzysort
(function(root, UMD) {
  if(typeof undefined === 'function' && undefined.amd) undefined([], UMD);
  else if('object' === 'object' && module.exports) module.exports = UMD();
  else root.fuzzysort = UMD();
})(commonjsGlobal, function UMD() { function fuzzysortNew(instanceOptions) {

  var fuzzysort = {

    single: function(search, target) {
      // search = fuzzysort.ensurePreparedSearch(search)
        if(typeof search !== 'object') {
          var searchPrepared = preparedSearchCache.get(search);
          if(searchPrepared !== undefined) search = searchPrepared;
          else preparedSearchCache.set(search, search = fuzzysort.prepareSearch(search));
        }
      if(search.length === 0) return null

      // target = fuzzysort.ensurePrepared(target)
        if(typeof target !== 'object') {
          var targetPrepared = preparedCache.get(target);
          if(targetPrepared !== undefined) target = targetPrepared;
          else preparedCache.set(target, target = fuzzysort.prepareFast(target));
        }
      if(target._targetLowerCodes.length === 0) return null

      return fuzzysort.algorithm(search, target, search[0])
    },

    go: function(search, targets, options) {
      // search = fuzzysort.ensurePreparedSearch(search)
        if(typeof search !== 'object') {
          var searchPrepared = preparedSearchCache.get(search);
          if(searchPrepared !== undefined) search = searchPrepared;
          else preparedSearchCache.set(search, search = fuzzysort.prepareSearch(search));
        }
      if(search.length === 0) return noResults
      var searchLowerCode = search[0];

      var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -Infinity;
      var limit = options && options.limit || instanceOptions && instanceOptions.limit || Infinity;
      var resultsLen = 0; var limitedCount = 0;

      // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]

      // options.keys
      if(options && options.keys) {
        var scoreFn = options.scoreFn || defaultScoreFn;
        var keys = options.keys;
        var keysLen = keys.length;
        for(var i = targets.length - 1; i >= 0; --i) { var obj = targets[i];
          var objResults = new Array(keysLen);
          for (var keyI = keysLen - 1; keyI >= 0; --keyI) {
            var key = keys[keyI];
            var target = getValue(obj, key);
            if(target === undefined) { objResults[keyI] = null; continue }

            // target = fuzzysort.ensurePrepared(target)
              if(typeof target !== 'object') {
                var targetPrepared = preparedCache.get(target);
                if(targetPrepared !== undefined) target = targetPrepared;
                else preparedCache.set(target, target = fuzzysort.prepareFast(target));
              }
            if(target._targetLowerCodes.length === 0) { objResults[keyI] = null; continue }

            objResults[keyI] = fuzzysort.algorithm(search, target, searchLowerCode);
          }
          objResults.obj = obj; // before scoreFn so scoreFn can use it
          var score = scoreFn(objResults);
          if(score === null) continue
          if(score < threshold) continue
          objResults.score = score;
          if(resultsLen < limit) { q.add(objResults); ++resultsLen; }
          else {
            ++limitedCount;
            if(score > q.peek().score) q.replaceTop(objResults);
          }
        }

      // options.key
      } else if(options && options.key) {
        var key = options.key;
        for(var i = targets.length - 1; i >= 0; --i) { var obj = targets[i];
          var target = getValue(obj, key);
          if(target === undefined) continue

          // target = fuzzysort.ensurePrepared(target)
            if(typeof target !== 'object') {
              var targetPrepared = preparedCache.get(target);
              if(targetPrepared !== undefined) target = targetPrepared;
              else preparedCache.set(target, target = fuzzysort.prepareFast(target));
            }
          if(target._targetLowerCodes.length === 0) continue

          var result = fuzzysort.algorithm(search, target, searchLowerCode);
          if(result === null) continue
          if(result.score < threshold) continue

          // have to clone result so duplicate targets from different obj can each reference the correct obj
          result = {target:result.target, _targetLowerCodes:null, _nextBeginningIndexes:null, score:result.score, indexes:result.indexes, obj:obj}; // hidden

          if(resultsLen < limit) { q.add(result); ++resultsLen; }
          else {
            ++limitedCount;
            if(result.score > q.peek().score) q.replaceTop(result);
          }
        }

      // no keys
      } else {
        for(var i = targets.length - 1; i >= 0; --i) { var target = targets[i];
          // target = fuzzysort.ensurePrepared(target)
            if(typeof target !== 'object') {
              var targetPrepared = preparedCache.get(target);
              if(targetPrepared !== undefined) target = targetPrepared;
              else preparedCache.set(target, target = fuzzysort.prepareFast(target));
            }
          if(target._targetLowerCodes.length === 0) continue

          var result = fuzzysort.algorithm(search, target, searchLowerCode);
          if(result === null) continue
          if(result.score < threshold) continue
          if(resultsLen < limit) { q.add(result); ++resultsLen; }
          else {
            ++limitedCount;
            if(result.score > q.peek().score) q.replaceTop(result);
          }
        }
      }

      if(resultsLen === 0) return noResults
      var results = new Array(resultsLen);
      for(var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll();
      results.total = resultsLen + limitedCount;
      return results
    },

    goAsync: function(search, targets, options) {
      var canceled = false;
      var p = new Promise(function(resolve, reject) {
        // search = fuzzysort.ensurePreparedSearch(search)
          if(typeof search !== 'object') {
            var searchPrepared = preparedSearchCache.get(search);
            if(searchPrepared !== undefined) search = searchPrepared;
            else preparedSearchCache.set(search, search = fuzzysort.prepareSearch(search));
          }
        if(search.length === 0) return resolve(noResults)
        var searchLowerCode = search[0];

        var itemsPerCheck = 1000;
        var q = fastpriorityqueue();
        var iCurrent = targets.length - 1;
        var threshold = options && options.threshold || instanceOptions && instanceOptions.threshold || -Infinity;
        var limit = options && options.limit || instanceOptions && instanceOptions.limit || Infinity;
        var resultsLen = 0; var limitedCount = 0;
        function step() {
          if(canceled) return reject('canceled')

          var startMs = Date.now();

          // This code is copy/pasted 3 times for performance reasons [options.keys, options.key, no keys]

          // options.keys
          if(options && options.keys) {
            var scoreFn = options.scoreFn || defaultScoreFn;
            var keys = options.keys;
            var keysLen = keys.length;
            for(var i = targets.length - 1; i >= 0; --i) { var obj = targets[i];
              var objResults = new Array(keysLen);
              for (var keyI = keysLen - 1; keyI >= 0; --keyI) {
                var key = keys[keyI];
                var target = getValue(obj, key);
                if(target === undefined) { objResults[keyI] = null; continue }

                // target = fuzzysort.ensurePrepared(target)
                  if(typeof target !== 'object') {
                    var targetPrepared = preparedCache.get(target);
                    if(targetPrepared !== undefined) target = targetPrepared;
                    else preparedCache.set(target, target = fuzzysort.prepareFast(target));
                  }
                if(target._targetLowerCodes.length === 0) { objResults[keyI] = null; continue }

                objResults[keyI] = fuzzysort.algorithm(search, target, searchLowerCode);
              }
              objResults.obj = obj; // before scoreFn so scoreFn can use it
              var score = scoreFn(objResults);
              if(score === null) continue
              if(score < threshold) continue
              objResults.score = score;
              if(resultsLen < limit) { q.add(objResults); ++resultsLen; }
              else {
                ++limitedCount;
                if(score > q.peek().score) q.replaceTop(objResults);
              }

              if(iCurrent%itemsPerCheck === 0) {
                if(Date.now() - startMs >= asyncInterval) {
                  isNode?setImmediate(step):setTimeout(step);
                  return
                }
              }
            }

          // options.key
          } else if(options && options.key) {
            var key = options.key;
            for(; iCurrent >= 0; --iCurrent) { var obj = targets[iCurrent];
              var target = getValue(obj, key);
              if(target === undefined) continue

              // target = fuzzysort.ensurePrepared(target)
                if(typeof target !== 'object') {
                  var targetPrepared = preparedCache.get(target);
                  if(targetPrepared !== undefined) target = targetPrepared;
                  else preparedCache.set(target, target = fuzzysort.prepareFast(target));
                }
              if(target._targetLowerCodes.length === 0) continue

              var result = fuzzysort.algorithm(search, target, searchLowerCode);
              if(result === null) continue
              if(result.score < threshold) continue

              // have to clone result so duplicate targets from different obj can each reference the correct obj
              result = {target:result.target, _targetLowerCodes:null, _nextBeginningIndexes:null, score:result.score, indexes:result.indexes, obj:obj}; // hidden

              if(resultsLen < limit) { q.add(result); ++resultsLen; }
              else {
                ++limitedCount;
                if(result.score > q.peek().score) q.replaceTop(result);
              }

              if(iCurrent%itemsPerCheck === 0) {
                if(Date.now() - startMs >= asyncInterval) {
                  isNode?setImmediate(step):setTimeout(step);
                  return
                }
              }
            }

          // no keys
          } else {
            for(; iCurrent >= 0; --iCurrent) { var target = targets[iCurrent];
              // target = fuzzysort.ensurePrepared(target)
                if(typeof target !== 'object') {
                  var targetPrepared = preparedCache.get(target);
                  if(targetPrepared !== undefined) target = targetPrepared;
                  else preparedCache.set(target, target = fuzzysort.prepareFast(target));
                }
              if(target._targetLowerCodes.length === 0) continue

              var result = fuzzysort.algorithm(search, target, searchLowerCode);
              if(result === null) continue
              if(result.score < threshold) continue
              if(resultsLen < limit) { q.add(result); ++resultsLen; }
              else {
                ++limitedCount;
                if(result.score > q.peek().score) q.replaceTop(result);
              }

              if(iCurrent%itemsPerCheck === 0) {
                if(Date.now() - startMs >= asyncInterval) {
                  isNode?setImmediate(step):setTimeout(step);
                  return
                }
              }
            }
          }

          if(resultsLen === 0) return resolve(noResults)
          var results = new Array(resultsLen);
          for(var i = resultsLen - 1; i >= 0; --i) results[i] = q.poll();
          results.total = resultsLen + limitedCount;
          resolve(results);
        }

        isNode?setImmediate(step):step();
      });
      p.cancel = function() { canceled = true; };
      return p
    },

    highlight: function(result, hOpen, hClose) {
      if(result === null) return null
      if(hOpen === undefined) hOpen = '<b>';
      if(hClose === undefined) hClose = '</b>';
      var highlighted = '';
      var matchesIndex = 0;
      var opened = false;
      var target = result.target;
      var targetLen = target.length;
      var matchesBest = result.indexes;
      for(var i = 0; i < targetLen; ++i) { var char = target[i];
        if(matchesBest[matchesIndex] === i) {
          ++matchesIndex;
          if(!opened) { opened = true;
            highlighted += hOpen;
          }

          if(matchesIndex === matchesBest.length) {
            highlighted += char + hClose + target.substr(i+1);
            break
          }
        } else {
          if(opened) { opened = false;
            highlighted += hClose;
          }
        }
        highlighted += char;
      }

      return highlighted
    },

    prepare: function(target) {
      return {target:target, _targetLowerCodes:fuzzysort.prepareLowerCodes(target), _nextBeginningIndexes:fuzzysort.prepareNextBeginningIndexes(target), score:null, indexes:null, obj:null} // hidden
    },
    prepareSearch: function(search) {
      return fuzzysort.prepareLowerCodes(search)
    },



    // Below this point is only internal code
    // Below this point is only internal code
    // Below this point is only internal code
    // Below this point is only internal code



    algorithm: function(searchLowerCodes, prepared, searchLowerCode) {
      var targetLowerCodes = prepared._targetLowerCodes;
      var searchLen = searchLowerCodes.length;
      var targetLen = targetLowerCodes.length;
      var searchI = 0; // where we at
      var targetI = 0; // where you at
      var typoSimpleI = 0;
      var matchesSimpleLen = 0;

      // very basic fuzzy match; to remove non-matching targets ASAP!
      // walk through target. find sequential matches.
      // if all chars aren't found then exit
      for(;;) {
        var isMatch = searchLowerCode === targetLowerCodes[targetI];
        if(isMatch) {
          matchesSimple[matchesSimpleLen++] = targetI;
          ++searchI; if(searchI === searchLen) break
          searchLowerCode = searchLowerCodes[typoSimpleI===0?searchI : (typoSimpleI===searchI?searchI+1 : (typoSimpleI===searchI-1?searchI-1 : searchI))];
        }

        ++targetI; if(targetI >= targetLen) { // Failed to find searchI
          // Check for typo or exit
          // we go as far as possible before trying to transpose
          // then we transpose backwards until we reach the beginning
          for(;;) {
            if(searchI <= 1) return null // not allowed to transpose first char
            if(typoSimpleI === 0) { // we haven't tried to transpose yet
              --searchI;
              var searchLowerCodeNew = searchLowerCodes[searchI];
              if(searchLowerCode === searchLowerCodeNew) continue // doesn't make sense to transpose a repeat char
              typoSimpleI = searchI;
            } else {
              if(typoSimpleI === 1) return null // reached the end of the line for transposing
              --typoSimpleI;
              searchI = typoSimpleI;
              searchLowerCode = searchLowerCodes[searchI + 1];
              var searchLowerCodeNew = searchLowerCodes[searchI];
              if(searchLowerCode === searchLowerCodeNew) continue // doesn't make sense to transpose a repeat char
            }
            matchesSimpleLen = searchI;
            targetI = matchesSimple[matchesSimpleLen - 1] + 1;
            break
          }
        }
      }

      var searchI = 0;
      var typoStrictI = 0;
      var successStrict = false;
      var matchesStrictLen = 0;

      var nextBeginningIndexes = prepared._nextBeginningIndexes;
      if(nextBeginningIndexes === null) nextBeginningIndexes = prepared._nextBeginningIndexes = fuzzysort.prepareNextBeginningIndexes(prepared.target);
      var firstPossibleI = targetI = matchesSimple[0]===0 ? 0 : nextBeginningIndexes[matchesSimple[0]-1];

      // Our target string successfully matched all characters in sequence!
      // Let's try a more advanced and strict test to improve the score
      // only count it as a match if it's consecutive or a beginning character!
      if(targetI !== targetLen) for(;;) {
        if(targetI >= targetLen) {
          // We failed to find a good spot for this search char, go back to the previous search char and force it forward
          if(searchI <= 0) { // We failed to push chars forward for a better match
            // transpose, starting from the beginning
            ++typoStrictI; if(typoStrictI > searchLen-2) break
            if(searchLowerCodes[typoStrictI] === searchLowerCodes[typoStrictI+1]) continue // doesn't make sense to transpose a repeat char
            targetI = firstPossibleI;
            continue
          }

          --searchI;
          var lastMatch = matchesStrict[--matchesStrictLen];
          targetI = nextBeginningIndexes[lastMatch];

        } else {
          var isMatch = searchLowerCodes[typoStrictI===0?searchI : (typoStrictI===searchI?searchI+1 : (typoStrictI===searchI-1?searchI-1 : searchI))] === targetLowerCodes[targetI];
          if(isMatch) {
            matchesStrict[matchesStrictLen++] = targetI;
            ++searchI; if(searchI === searchLen) { successStrict = true; break }
            ++targetI;
          } else {
            targetI = nextBeginningIndexes[targetI];
          }
        }
      }

      { // tally up the score & keep track of matches for highlighting later
        if(successStrict) { var matchesBest = matchesStrict; var matchesBestLen = matchesStrictLen; }
        else { var matchesBest = matchesSimple; var matchesBestLen = matchesSimpleLen; }
        var score = 0;
        var lastTargetI = -1;
        for(var i = 0; i < searchLen; ++i) { var targetI = matchesBest[i];
          // score only goes down if they're not consecutive
          if(lastTargetI !== targetI - 1) score -= targetI;
          lastTargetI = targetI;
        }
        if(!successStrict) {
          score *= 1000;
          if(typoSimpleI !== 0) score += typoPenalty;
        } else {
          if(typoStrictI !== 0) score += typoPenalty;
        }
        score -= targetLen - searchLen;
        prepared.score = score;
        prepared.indexes = new Array(matchesBestLen); for(var i = matchesBestLen - 1; i >= 0; --i) prepared.indexes[i] = matchesBest[i];

        return prepared
      }
    },

    prepareFast: function(target) {
      return {target:target, _targetLowerCodes:fuzzysort.prepareLowerCodes(target), _nextBeginningIndexes:null, score:null, indexes:null, obj:null} // hidden
    },

    prepareLowerCodes: function(str) {
      var lowerCodes = new Array(str.length);
      var lower = str.toLowerCase();
      var strLen = str.length;
      for(var i = 0; i < strLen; ++i) lowerCodes[i] = lower.charCodeAt(i);
      return lowerCodes
    },
    prepareBeginningIndexes: function(target) {
      var targetLen = target.length;
      var beginningIndexes = []; var beginningIndexesLen = 0;
      var wasUpper = false;
      var wasAlphanum = false;
      for(var i = 0; i < targetLen; ++i) {
        var targetCode = target.charCodeAt(i);
        var isUpper = targetCode>=65&&targetCode<=90;
        var isAlphanum = isUpper || targetCode>=97&&targetCode<=122 || targetCode>=48&&targetCode<=57;
        var isBeginning = isUpper && !wasUpper || !wasAlphanum || !isAlphanum;
        wasUpper = isUpper;
        wasAlphanum = isAlphanum;
        if(isBeginning) beginningIndexes[beginningIndexesLen++] = i;
      }
      return beginningIndexes
    },
    prepareNextBeginningIndexes: function(target) {
      var targetLen = target.length;
      var beginningIndexes = fuzzysort.prepareBeginningIndexes(target);
      var nextBeginningIndexes = new Array(targetLen);
      var lastIsBeginning = beginningIndexes[0];
      var lastIsBeginningI = 0;
      for(var i = 0; i < targetLen; ++i) {
        if(lastIsBeginning > i) {
          nextBeginningIndexes[i] = lastIsBeginning;
        } else {
          lastIsBeginning = beginningIndexes[++lastIsBeginningI];
          nextBeginningIndexes[i] = lastIsBeginning===undefined ? targetLen : lastIsBeginning;
        }
      }
      return nextBeginningIndexes
    },

    // ensurePrepared: function(target) {
    //   if(typeof target === 'object') return target
    //   var targetPrepared = preparedCache.get(target)
    //   if(targetPrepared !== undefined) return targetPrepared
    //   preparedCache.set(target, targetPrepared = fuzzysort.prepareFast(target))
    //   return targetPrepared
    // },
    // ensurePreparedSearch: function(search) {
    //   if(typeof search === 'object') return search
    //   var searchPrepared = preparedSearchCache.get(search)
    //   if(searchPrepared !== undefined) return searchPrepared
    //   preparedSearchCache.set(search, searchPrepared = fuzzysort.prepareSearch(search))
    //   return searchPrepared
    // },

    cleanup: cleanup,
    new: fuzzysortNew,
  };
  return fuzzysort
} // fuzzysortNew

// This stuff is outside fuzzysortNew, because it's shared with instances of fuzzysort.new()
var isNode = typeof commonjsRequire !== 'undefined' && typeof window === 'undefined';
// var MAX_INT = Number.MAX_SAFE_INTEGER
// var MIN_INT = Number.MIN_VALUE
var typoPenalty = -20;
var asyncInterval = 32;
var preparedCache = new Map();
var preparedSearchCache = new Map();
var noResults = []; noResults.total = 0;
var matchesSimple = []; var matchesStrict = [];
function cleanup() { preparedCache.clear(); preparedSearchCache.clear(); matchesSimple = []; matchesStrict = []; }
function defaultScoreFn(a) {
  var max = -Infinity;
  for (var i = a.length - 1; i >= 0; --i) {
    var result = a[i]; if(result === null) continue
    var score = result.score;
    if(score > max) max = score;
  }
  if(max === -Infinity) return null
  return max
}

// prop = 'key'              25ms
// prop = 'key1.key2         100ms
// prop = ['key1', 'key'2]   270ms
function getValue(obj, prop) {
  var tmp = obj[prop]; if(tmp !== undefined) return tmp
  var segs = prop;
  if(!Array.isArray(prop)) segs = prop.split('.');
  var len = segs.length;
  var i = -1;
  while (obj && (++i < len)) obj = obj[segs[i]];
  return obj
}

// Hacked version of https://github.com/lemire/FastPriorityQueue.js
var fastpriorityqueue=function(){var r=[],o=0,e={};function n(){for(var e=0,n=r[e],c=1;c<o;){var f=c+1;e=c, f<o&&r[f].score<r[c].score&&(e=f), r[e-1>>1]=r[e], c=1+(e<<1);}for(var a=e-1>>1;e>0&&n.score<r[a].score;a=(e=a)-1>>1)r[e]=r[a];r[e]=n;}return e.add=function(e){var n=o;r[o++]=e;for(var c=n-1>>1;n>0&&e.score<r[c].score;c=(n=c)-1>>1)r[n]=r[c];r[n]=e;}, e.poll=function(){if(0!==o){var e=r[0];return r[0]=r[--o], n(), e}}, e.peek=function(e){if(0!==o)return r[0]}, e.replaceTop=function(o){r[0]=o, n();}, e};
var q = fastpriorityqueue();

return fuzzysortNew()
}); // UMD

// TODO: (performance) layout memory in an optimal way to go fast by avoiding cache misses

// TODO: (performance) preparedCache is a memory leak

// TODO: (like sublime) backslash === forwardslash

// TODO: (performance) i have no idea how well optizmied the allowing typos algorithm is

// TODO: (performance) search could assume to be lowercase?
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var fileIconsService = null;
var promise = null;

var fileReplace = async function fileReplace(_ref) {
	var path$$1 = _ref.path,
	    line = _ref.line,
	    lineNumber = _ref.lineNumber,
	    match = _ref.match,
	    replace = _ref.replace,
	    column = _ref.column;

	var newLine = line.slice(0, column) + replace.replace('\\', '\\\\').replace('/', '\\/') + line.slice(column + match.length);

	// note: escape newLine
	var sedRegex = lineNumber + ',' + lineNumber + 's/^.*$/' + newLine + '/';
	var cmdProcess = spawnInProject('sed', ['-i', '', '-e', sedRegex, path$$1]);
	await new Promise(function (resolve) {
		cmdProcess.on('exit', function () {
			resolve();
		});
	});
};

var fuzzyFilter = function fuzzyFilter(pattern, data) {
	promise && promise.cancel();
	promise = fuzzysort.goAsync(pattern, data, { key: 'value' });
	return promise.then(function (filteredData) {
		return filteredData.map(function (x) {
			return x.obj;
		});
	});
};

var setFileIconsService = function setFileIconsService(service) {
	fileIconsService = service;
};

var iconClassForPath = function iconClassForPath(path$$1) {
	return fileIconsService.iconClassForPath(path$$1);
};

var escapeHTML = function escapeHTML(str) {
	return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
		return '&#' + i.charCodeAt(0) + ';';
	});
};

var wrap = function wrap(str) {
	var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	var start = arguments[2];
	var end = arguments[3];
	var className = arguments[4];
	var replace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

	var match = fuzzysort.single(pattern, str);
	var indexes = match && match.indexes ? match.indexes : [];
	var styleHash = indexes.reduce(function (acc, x) {
		acc[x] = 'fuzzy';
		return acc;
	}, {});

	styleHash[start] = styleHash[start] ? 'styledAndFuzzy' : 'styled';
	styleHash[end] = styleHash[end] ? 'closeStyledAndFuzzy' : 'closeStyled';

	var wrappedStr = '';
	for (var i = 0; i < str.length; i++) {
		var c = escapeHTML(str[i]);

		if (styleHash[i] === 'fuzzy') {
			wrappedStr += '<span class="highlight">' + c + '</span>';
		} else if (styleHash[i] === 'styledAndFuzzy') {
			wrappedStr += '<span class="' + className + '"><span class="highlight">' + c + '</span>';
		} else if (styleHash[i] === 'styled') {
			wrappedStr += '<span class="' + className + '">' + c;
		} else if (styleHash[i] === 'closeStyled') {
			wrappedStr += c + '</span>' + replace;
		} else if (styleHash[i] === 'closeStyledAndFuzzy') {
			wrappedStr += '<span class="highlight">' + c + '</span></span>' + replace;
		} else {
			wrappedStr += c;
		}
	}

	return wrappedStr;
};

var spawnInProject = function spawnInProject(cmd, args) {
	var cwd = atom.project.getPaths()[0];
	return child_process.spawn(cmd, args, {
		cwd: cwd
	});
};

var defaultRenderer = function defaultRenderer(_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    className = _ref.className,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var value = item.value;


	var finalClassName = classnames(className, index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	var wrappedValue = wrap(value, pattern);

	return react.createElement('div', {
		className: finalClassName,
		'aria-role': 'button',
		onClick: function onClick() {
			return accept(item);
		},
		dangerouslySetInnerHTML: { __html: wrappedValue }
	});
};

var commandFactoryFactory = (function (store) {
	return function (optionsFactory) {
		var defaults$$1 = {
			preview: null,
			sliceLength: DEFAULT_SLICE_LENGTH,
			columns: 1,
			renderer: defaultRenderer
		};

		var options = _extends({}, defaults$$1, optionsFactory(react, store));

		var command = function command() {
			var extraOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var finalOptions = _extends({}, options, extraOptions);

			store.dispatch({
				type: 'SHOW',
				payload: finalOptions
			});
		};

		return command;
	};
});

var loadData = (function (onData) {
	var cmdProcess = spawnInProject('rg', ['--files']);
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').filter(function (s) {
			return s.length > 1;
		}).map(function (value) {
			return { value: value };
		}));
	});

	return function () {
		cmdProcess.stdin.pause();
		cmdProcess.kill();
	};
});

var renderer = (function (props) {
	return defaultRenderer(_extends({}, props, {
		className: ['icon'].concat(toConsumableArray(iconClassForPath(props.item.value)))
	}));
});

var files = (function (React, store) {
	var accept = function accept(file) {
		atom.workspace.open(file.value);
		store.dispatch({
			type: 'HIDE'
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Find files in project',
		id: 'sparkling-files'
	};
});

var isVisible = function isVisible(state) {
	return state.visible;
};
var getOptions = function getOptions(state) {
	return state.options;
};
var getData = function getData(state) {
	return state.data;
};
var getIndex = function getIndex(state) {
	return state.index;
};
var getOffset = function getOffset(state) {
	return state.offset;
};
var getPattern = function getPattern(state) {
	return state.pattern.value;
};
var getSelectedValue = function getSelectedValue(state) {
	return getSparklingData(state)[getOffset(state) + getIndex(state)];
};
var getRawDataLength = function getRawDataLength(state) {
	return state.data.length;
};
var getSparklingData = function getSparklingData(state) {
	return state.sparklingData;
};
var getFind = function getFind(state) {
	return state.find;
};
var isFindVisible = function isFindVisible(state) {
	return state.findVisible;
};
var getReplace = function getReplace(state) {
	return state.replace;
};

var getExtraInput = function getExtraInput(state) {
	return state.extraInput;
};
var isSmartCase = function isSmartCase(state) {
	return state.smartCase;
};
var getScope = function getScope(state) {
	return state.scope;
};
var isLiteralSearch = function isLiteralSearch(state) {
	return state.literalSearch;
};
var isWholeWord = function isWholeWord(state) {
	return state.wholeWord;
};

var loadDataFactory = (function (store) {
	return function (onData) {
		var options = getOptions(store.getState());
		var path$$1 = options.path;


		var cmdProcess = spawnInProject('ls', ['-a', path$$1]);

		cmdProcess.stdout.on('data', function (data) {
			var options = getOptions(store.getState());
			var path$$1 = options.path;


			onData(data.toString('utf-8').split('\n').filter(function (s) {
				return s.length && s !== '.';
			}).map(function (value) {
				var absolutePath = path.resolve(path$$1, value);

				if (value === '.') {
					return { value: '.', absolutePath: absolutePath, isFolder: true };
				} else if (value === '..') {
					return { value: '..', absolutePath: absolutePath, isFolder: true };
				}

				var cwd = atom.project.getPaths()[0];
				var projectRelativePath = cwd === absolutePath ? cwd : absolutePath.replace(cwd, '~');

				var isFolder = fs.lstatSync(absolutePath).isDirectory();
				return { value: projectRelativePath, absolutePath: absolutePath, isFolder: isFolder };
			}).sort(function (a, b) {
				if (a.isFolder && !b.isFolder) {
					return -1;
				} else if (!a.isFolder && b.isFolder) {
					return 1;
				} else if (a.absolutePath > b.absolutePath) {
					return 1;
				} else if (b.absolutePath < a.absolutePath) {
					return -1;
				}

				return 0;
			}));
		});

		return function () {
			cmdProcess.stdin.pause();
			cmdProcess.kill();
		};
	};
});

var renderer$1 = (function (props) {
	var absolutePath = props.item.absolutePath;


	return defaultRenderer(_extends({}, props, {
		className: ['icon'].concat(toConsumableArray(iconClassForPath(absolutePath)))
	}));
});

var ls = (function (React, store) {
	var loadData = loadDataFactory(store);

	var accept = function accept(_ref) {
		var absolutePath = _ref.absolutePath;

		var _getOptions = getOptions(store.getState()),
		    lsCommand = _getOptions.lsCommand;

		if (fs.lstatSync(absolutePath).isDirectory()) {
			lsCommand({ path: absolutePath, description: absolutePath, lsCommand: lsCommand });
		} else {
			store.dispatch({ type: 'HIDE' });
			atom.workspace.open(absolutePath);
		}
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$1,
		sliceLength: 20,
		columns: 4,
		description: 'Project navigation',
		id: 'sparkling-ls'
	};
});

var copyFiles = (function (React, store) {
	var accept = function accept(file) {
		store.dispatch({
			type: 'SHOW_INPUT',
			payload: {
				id: 'sparkling-copy-file-confirm',
				originPath: file.value,
				value: file.value
			}
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Copy files in project',
		id: 'sparkling-copy-files'
	};
});

var moveFiles = (function (React, store) {
	var accept = function accept(file) {
		store.dispatch({
			type: 'SHOW_INPUT',
			payload: {
				id: 'sparkling-move-file-confirm',
				originPath: file.value,
				value: file.value
			}
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Move files in project',
		id: 'sparkling-move-files'
	};
});

var removeFiles = (function (React, store) {
	var accept = function accept(file) {
		spawnInProject('rm', [file.value]);

		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: file
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Remove files in project',
		id: 'sparkling-files'
	};
});

var loadDataFactory$1 = (function () {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    hideDeletedFiles = _ref.hideDeletedFiles;

	return function (onData) {
		var cmdProcess = spawnInProject('git', ['status', '-s']);

		cmdProcess.stdout.on('data', function (data) {
			onData(data.toString('utf-8').split('\n').filter(function (value) {
				return value.trim() !== '';
			}).reduce(function (acc, value) {
				var path$$1 = value.slice(2).trim();
				var status = value.slice(0, 2);

				if (hideDeletedFiles && status === 'D' || status === 'DD') {
					return acc;
				}

				acc.push({ value: path$$1, status: status, path: path$$1 });
				return acc;
			}, []));
		});
	};
});

var renderer$2 = (function (_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    className = _ref.className,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var value = item.value,
	    status = item.status;


	var finalClassName = classnames(className, ['icon'].concat(toConsumableArray(iconClassForPath(value))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	var wrappedValue = wrap(value, pattern);

	var statusLabel = void 0;

	if (status === 'M ') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-modified-staged' },
			'modified'
		);
	} else if (status === ' M') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-modified' },
			'modified'
		);
	} else if (status === 'MM') {
		statusLabel = [react.createElement(
			'span',
			{ className: 'git-status-modified-staged' },
			'modi'
		), react.createElement(
			'span',
			{ className: 'git-status-modified' },
			'fied'
		)];
	} else if (status === '??') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-untracked' },
			'untracked'
		);
	} else if (status === 'D ') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-deleted-staged' },
			'deleted'
		);
	} else if (status === ' D') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-deleted' },
			'deleted'
		);
	} else if (status === 'AD') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-deleted' },
			'deleted'
		);
	} else if (status === 'DD') {
		statusLabel = [react.createElement(
			'span',
			{ className: 'git-status-deleted-staged' },
			'del'
		), react.createElement(
			'span',
			{ className: 'git-status-deleted' },
			'eted'
		)];
	} else if (status === 'A ') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-new-file-staged' },
			'new file'
		);
	} else if (status === ' A') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-new-file-staged' },
			'new file'
		);
	} else if (status === 'AM') {
		statusLabel = react.createElement(
			'span',
			{ className: 'git-status-new-file-staged' },
			'new file'
		);
	} else {
		statusLabel = status;
	}

	return react.createElement(
		'div',
		{
			className: finalClassName,
			'aria-role': 'button',
			onClick: function onClick() {
				return accept(item);
			}
		},
		react.createElement(
			'span',
			{ className: 'git-status' },
			statusLabel
		),
		react.createElement('span', { dangerouslySetInnerHTML: { __html: wrappedValue } })
	);
});

var gitFiles = (function (React, store) {
	var loadData = loadDataFactory$1({ hideDeletedFiles: true });

	var accept = function accept(_ref) {
		var path$$1 = _ref.path;

		atom.workspace.open(path$$1);
		store.dispatch({
			type: 'HIDE'
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$2,
		columns: 3,
		description: 'Find git status files',
		id: 'sparkling-git-files'
	};
});

var loadData$1 = (function (onData) {
	var cmdProcess = spawnInProject('git', ['branch']);
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').filter(function (s) {
			return s.length > 1;
		}).map(function (value) {
			return { value: value };
		}));
	});
});

var gitBranches = (function (React, store) {
	var accept = function accept(branch) {
		var value = branch.value.trim(0);

		if (/^\*/.test(value)) {
			return;
		}

		var cmdProcess = spawnInProject('git', ['checkout', value]);
		cmdProcess.stdout.on('data', function () {
			store.dispatch({
				type: 'HIDE'
			});
		});
	};

	return {
		loadData: loadData$1,
		accept: accept,
		columns: 3,
		description: 'Checkout git branches',
		id: 'sparkling-git-branches'
	};
});

var loadData$2 = (function (onData) {
	var cmdProcess = spawnInProject('git', ['log', '--pretty=oneline', '--abbrev-commit']);
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').filter(function (s) {
			return s.length > 1;
		}).map(function (value) {
			return { value: value };
		}));
	});
});

var gitLog = (function (React, store) {
	var accept = function accept(commit) {
		var value = commit.value.split(' ', 1)[0];
		atom.clipboard.write(value);
		store.dispatch({
			type: 'HIDE'
		});
	};

	return {
		loadData: loadData$2,
		accept: accept,
		description: 'git log - Copy git commit hash to clipboard',
		id: 'sparkling-git-log'
	};
});

var gitLogCheckout = (function (React, store) {
	var accept = function accept(commit) {
		var value = commit.value.split(' ', 1)[0];

		var cmdProcess = spawnInProject('git', ['checkout', value]);
		cmdProcess.on('exit', function () {
			store.dispatch({
				type: 'HIDE'
			});
		});
	};

	return {
		loadData: loadData$2,
		accept: accept,
		description: 'git log - Checkout git commit',
		id: 'sparkling-git-commit'
	};
});

var gitStage = (function (React, store) {
	var loadData = loadDataFactory$1({ hideDeletedFiles: false });

	var accept = function accept(_ref) {
		var path$$1 = _ref.path,
		    status = _ref.status;

		var cmdProcess = void 0;
		var unstaged = [' M', 'MM', '??', ' D', 'AD', 'DD', ' A'];

		if (unstaged.includes(status)) {
			cmdProcess = spawnInProject('git', ['add', path$$1]);
		} else {
			cmdProcess = spawnInProject('git', ['reset', path$$1]);
		}

		cmdProcess.on('exit', function () {
			store.dispatch({
				type: 'RELOAD'
			});
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$2,
		columns: 3,
		description: 'Stage and unstage git files',
		id: 'sparkling-git-stage'
	};
});

var gitCheckout = (function (React, store) {
	var loadData = loadDataFactory$1();

	var accept = function accept(_ref) {
		var path$$1 = _ref.path;

		var cmdProcess = spawnInProject('git', ['checkout', '--', path$$1]);

		cmdProcess.on('exit', function () {
			store.dispatch({
				type: 'RELOAD'
			});
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$2,
		columns: 3,
		description: 'git checkout -- files',
		id: 'sparkling-git-checkout'
	};
});

var loadData$3 = (function (onData) {
	var cmdProcess = spawnInProject('git', ['reflog']);
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').filter(function (s) {
			return s.length > 1;
		}).map(function (value) {
			return { value: value };
		}));
	});
});

var gitReflog = (function (React, store) {
	var accept = function accept(commit) {
		var value = commit.value.split(' ', 1)[0];
		atom.clipboard.write(value);
		store.dispatch({
			type: 'HIDE'
		});
	};

	return {
		loadData: loadData$3,
		accept: accept,
		description: 'git reflog - Copy git commit hash to clipboard',
		id: 'sparkling-git-reflog'
	};
});

var gitReflogCheckout = (function (React, store) {
	var accept = function accept(commit) {
		var value = commit.value.split(' ', 1)[0];

		var cmdProcess = spawnInProject('git', ['checkout', value]);
		cmdProcess.on('exit', function () {
			store.dispatch({
				type: 'HIDE'
			});
		});
	};

	return {
		loadData: loadData$3,
		accept: accept,
		description: 'git reflog - Checkout git commit',
		id: 'sparkling-git-reflog'
	};
});

var renderer$3 = (function (_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    className = _ref.className,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var value = item.value;

	var start = 0;
	var end = value.indexOf(':');
	var wrappedValue = wrap(value.replace(':', ''), pattern, start, end, 'sparkling-line-number');

	var finalClassName = classnames(className, index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	return react.createElement('div', {
		className: finalClassName,
		'aria-role': 'button',
		onClick: function onClick() {
			return accept(item);
		},
		dangerouslySetInnerHTML: { __html: wrappedValue }
	});
});

var lines = (function (React, store) {
	var loadData = function loadData(onData) {
		var editor = atom.workspace.getActiveTextEditor();
		var buffer = editor.getBuffer();
		var lines = buffer.getLines().map(function (value, lineNumber) {
			return {
				value: lineNumber + 1 + ' : ' + value,
				lineNumber: lineNumber
			};
		});
		onData(lines);
	};

	var accept = function accept(line) {
		store.dispatch({ type: 'HIDE' });
		var editor = atom.workspace.getActiveTextEditor();
		editor.setCursorBufferPosition([line.lineNumber, 0]);
		var cursor = editor.cursors[0];
		cursor.moveToFirstCharacterOfLine();
	};

	return {
		loadData: loadData,
		accept: accept,
		description: 'Find lines in current buffer',
		id: 'sparkling-buffer-lines',
		sliceLength: 10,
		renderer: renderer$3
	};
});

var loadDataFactory$2 = (function (store) {
	return function (onData) {
		var state = store.getState();
		var find = getFind(state);
		var smartCase = isSmartCase(state);
		var scope = getScope(state);
		var literalSearch = isLiteralSearch(state);
		var wholeWord = isWholeWord(state);

		var cmdProcess = spawnInProject('ag', [find, '--ackmate'].concat(toConsumableArray(scope === '' ? [] : ['-G', scope]), toConsumableArray(smartCase ? ['--smart-case'] : []), toConsumableArray(literalSearch ? ['--literal'] : []), toConsumableArray(wholeWord ? ['--word-regexp'] : [])));

		cmdProcess.stdout.on('data', function (data) {
			var dataLines = data.toString('utf-8').split('\n');
			// console.log('data.toString("utf-8"): ', data.toString('utf-8'))
			// console.log('dataLines: ', dataLines)
			var processedData = [];

			var path$$1 = '';
			var i = 0;

			while (i < dataLines.length) {
				var dataLine = dataLines[i];

				if (!dataLine || !dataLine.length) {
					i++;
					continue;
				} else if (dataLine[0] === ':') {
					path$$1 = dataLine.slice(1);
				} else {
					var _dataLine$split = dataLine.split(';'),
					    _dataLine$split2 = toArray(_dataLine$split),
					    lineNumberStr = _dataLine$split2[0],
					    splitRestDataLine = _dataLine$split2.slice(1);

					var restDataLine = splitRestDataLine.join(';');

					var _restDataLine$split = restDataLine.split(':'),
					    _restDataLine$split2 = toArray(_restDataLine$split),
					    matches = _restDataLine$split2[0],
					    splitLine = _restDataLine$split2.slice(1);

					var line = splitLine.join(':');
					var lineNumber = parseInt(lineNumberStr);
					var splitMatches = matches.split(',');
					var preValue = [path$$1, lineNumber].join(':');

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = splitMatches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var match = _step.value;

							var _match$split = match.split(' '),
							    _match$split2 = slicedToArray(_match$split, 2),
							    startStr = _match$split2[0],
							    lengthStr = _match$split2[1];

							var column = parseInt(startStr);
							var length = parseInt(lengthStr);
							var start = preValue.length + 1 + column;
							var end = length + start - 1;

							processedData.push({
								value: preValue + ' ' + line,
								line: line,
								match: line.slice(column, column + length),
								path: path$$1,
								lineNumber: lineNumber,
								column: parseInt(startStr),
								start: start,
								end: end
							});
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				}

				i++;
			}

			onData(processedData);
		});

		return function () {
			cmdProcess.stdin.pause();
			cmdProcess.kill();
		};
	};
});

var renderer$4 = (function (_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var start = item.start,
	    end = item.end,
	    value = item.value,
	    path$$1 = item.path;


	var wrappedValue = wrap(value, pattern, start, end, 'find-highlight');

	var finalClassName = classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	return react.createElement('div', {
		className: finalClassName,
		'aria-role': 'button',
		onClick: function onClick() {
			return accept(item);
		},
		dangerouslySetInnerHTML: { __html: wrappedValue }
	});
});

var find = (function (React, store) {
	var loadData = loadDataFactory$2(store);

	var accept = function accept(value) {
		var scope = getScope(store.getState());
		var cwd = atom.project.getPaths()[0];
		var absolutePath = path.resolve(cwd, '.' + scope);

		if (value && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
			store.dispatch({ type: 'HIDE' });
		}

		atom.workspace.open(value.path, {
			initialLine: value.lineNumber - 1,
			initialColumn: value.column
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$4,
		description: 'Find pattern in project',
		id: 'sparkling-project-find',
		sliceLength: 10,
		onValue: function onValue(value) {
			var scope = getScope(store.getState());
			var cwd = atom.project.getPaths()[0];
			var absolutePath = path.resolve(cwd, '.' + scope);

			if (value && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
				var editor = atom.workspace.getActiveTextEditor();
				editor.setCursorBufferPosition([value.lineNumber - 1, value.column]);
				var cursor = editor.cursors[0];
				cursor.moveToFirstCharacterOfLine();
			}
		}
	};
});

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant_1(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning_1(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction_1.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning_1(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning_1(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction_1.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning_1(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction_1.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var subscriptionShape = propTypes.shape({
  trySubscribe: propTypes.func.isRequired,
  tryUnsubscribe: propTypes.func.isRequired,
  notifyNestedSubs: propTypes.func.isRequired,
  isSubscribed: propTypes.func.isRequired
});

var storeShape = propTypes.shape({
  subscribe: propTypes.func.isRequired,
  dispatch: propTypes.func.isRequired,
  getState: propTypes.func.isRequired
});

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning$3(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  warning$3('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

function createProvider() {
  var _Provider$childContex;

  var storeKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'store';
  var subKey = arguments[1];

  var subscriptionKey = subKey || storeKey + 'Subscription';

  var Provider = function (_Component) {
    _inherits(Provider, _Component);

    Provider.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
    };

    function Provider(props, context) {
      _classCallCheck(this, Provider);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

      _this[storeKey] = props.store;
      return _this;
    }

    Provider.prototype.render = function render() {
      return react_1.only(this.props.children);
    };

    return Provider;
  }(react_3);

  if (process.env.NODE_ENV !== 'production') {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      if (this[storeKey] !== nextProps.store) {
        warnAboutReceivingStore();
      }
    };
  }

  Provider.propTypes = {
    store: storeShape.isRequired,
    children: propTypes.element.isRequired
  };
  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = storeShape.isRequired, _Provider$childContex[subscriptionKey] = subscriptionShape, _Provider$childContex);

  return Provider;
}

var Provider = createProvider();

var hoistNonReactStatics = createCommonjsModule(function (module, exports) {
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
(function (global, factory) {
    module.exports = factory();
}(commonjsGlobal, (function () {
    var REACT_STATICS = {
        childContextTypes: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDefaultProps: true,
        getDerivedStateFromProps: true,
        mixins: true,
        propTypes: true,
        type: true
    };
    
    var KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true
    };
    
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var getPrototypeOf = Object.getPrototypeOf;
    var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
    
    return function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
            
            if (objectPrototype) {
                var inheritedComponent = getPrototypeOf(sourceComponent);
                if (inheritedComponent && inheritedComponent !== objectPrototype) {
                    hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
                }
            }
            
            var keys = getOwnPropertyNames(sourceComponent);
            
            if (getOwnPropertySymbols) {
                keys = keys.concat(getOwnPropertySymbols(sourceComponent));
            }
            
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                    try { // Avoid failures from read-only properties
                        defineProperty(targetComponent, key, descriptor);
                    } catch (e) {}
                }
            }
            
            return targetComponent;
        }
        
        return targetComponent;
    };
})));
});

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant$3 = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1$2 = invariant$3;

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

var CLEARED = null;
var nullListeners = {
  notify: function notify() {}
};

function createListenerCollection() {
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  var current = [];
  var next = [];

  return {
    clear: function clear() {
      next = CLEARED;
      current = CLEARED;
    },
    notify: function notify() {
      var listeners = current = next;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },
    get: function get() {
      return next;
    },
    subscribe: function subscribe(listener) {
      var isSubscribed = true;
      if (next === current) next = current.slice();
      next.push(listener);

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return;
        isSubscribed = false;

        if (next === current) next = current.slice();
        next.splice(next.indexOf(listener), 1);
      };
    }
  };
}

var Subscription = function () {
  function Subscription(store, parentSub, onStateChange) {
    _classCallCheck$1(this, Subscription);

    this.store = store;
    this.parentSub = parentSub;
    this.onStateChange = onStateChange;
    this.unsubscribe = null;
    this.listeners = nullListeners;
  }

  Subscription.prototype.addNestedSub = function addNestedSub(listener) {
    this.trySubscribe();
    return this.listeners.subscribe(listener);
  };

  Subscription.prototype.notifyNestedSubs = function notifyNestedSubs() {
    this.listeners.notify();
  };

  Subscription.prototype.isSubscribed = function isSubscribed() {
    return Boolean(this.unsubscribe);
  };

  Subscription.prototype.trySubscribe = function trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);

      this.listeners = createListenerCollection();
    }
  };

  Subscription.prototype.tryUnsubscribe = function tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  };

  return Subscription;
}();

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var hotReloadingVersion = 0;
var dummyState = {};
function noop() {}
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  var selector = {
    run: function runComponentSelector(props) {
      try {
        var nextProps = sourceSelector(store.getState(), props);
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };

  return selector;
}

function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory) {
  var _contextTypes, _childContextTypes;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$getDisplayName = _ref.getDisplayName,
      getDisplayName = _ref$getDisplayName === undefined ? function (name) {
    return 'ConnectAdvanced(' + name + ')';
  } : _ref$getDisplayName,
      _ref$methodName = _ref.methodName,
      methodName = _ref$methodName === undefined ? 'connectAdvanced' : _ref$methodName,
      _ref$renderCountProp = _ref.renderCountProp,
      renderCountProp = _ref$renderCountProp === undefined ? undefined : _ref$renderCountProp,
      _ref$shouldHandleStat = _ref.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref$shouldHandleStat === undefined ? true : _ref$shouldHandleStat,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === undefined ? 'store' : _ref$storeKey,
      _ref$withRef = _ref.withRef,
      withRef = _ref$withRef === undefined ? false : _ref$withRef,
      connectOptions = _objectWithoutProperties(_ref, ['getDisplayName', 'methodName', 'renderCountProp', 'shouldHandleStateChanges', 'storeKey', 'withRef']);

  var subscriptionKey = storeKey + 'Subscription';
  var version = hotReloadingVersion++;

  var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = storeShape, _contextTypes[subscriptionKey] = subscriptionShape, _contextTypes);
  var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = subscriptionShape, _childContextTypes);

  return function wrapWithConnect(WrappedComponent) {
    invariant_1$2(typeof WrappedComponent == 'function', 'You must pass a component to the function returned by ' + (methodName + '. Instead received ' + JSON.stringify(WrappedComponent)));

    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends$1({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      withRef: withRef,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var Connect = function (_Component) {
      _inherits$1(Connect, _Component);

      function Connect(props, context) {
        _classCallCheck$2(this, Connect);

        var _this = _possibleConstructorReturn$1(this, _Component.call(this, props, context));

        _this.version = version;
        _this.state = {};
        _this.renderCount = 0;
        _this.store = props[storeKey] || context[storeKey];
        _this.propsMode = Boolean(props[storeKey]);
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);

        invariant_1$2(_this.store, 'Could not find "' + storeKey + '" in either the context or props of ' + ('"' + displayName + '". Either wrap the root component in a <Provider>, ') + ('or explicitly pass "' + storeKey + '" as a prop to "' + displayName + '".'));

        _this.initSelector();
        _this.initSubscription();
        return _this;
      }

      Connect.prototype.getChildContext = function getChildContext() {
        var _ref2;

        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        var subscription = this.propsMode ? null : this.subscription;
        return _ref2 = {}, _ref2[subscriptionKey] = subscription || this.context[subscriptionKey], _ref2;
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        if (!shouldHandleStateChanges) return;

        // componentWillMount fires during server side rendering, but componentDidMount and
        // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
        // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
        // To handle the case where a child component may have triggered a state change by
        // dispatching an action in its componentWillMount, we have to re-run the select and maybe
        // re-render.
        this.subscription.trySubscribe();
        this.selector.run(this.props);
        if (this.selector.shouldComponentUpdate) this.forceUpdate();
      };

      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps);
      };

      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate;
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.subscription) this.subscription.tryUnsubscribe();
        this.subscription = null;
        this.notifyNestedSubs = noop;
        this.store = null;
        this.selector.run = noop;
        this.selector.shouldComponentUpdate = false;
      };

      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
        invariant_1$2(withRef, 'To access the wrapped instance, you need to specify ' + ('{ withRef: true } in the options argument of the ' + methodName + '() call.'));
        return this.wrappedInstance;
      };

      Connect.prototype.setWrappedInstance = function setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      };

      Connect.prototype.initSelector = function initSelector() {
        var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
        this.selector = makeSelectorStateful(sourceSelector, this.store);
        this.selector.run(this.props);
      };

      Connect.prototype.initSubscription = function initSubscription() {
        if (!shouldHandleStateChanges) return;

        // parentSub's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.
        var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this));

        // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
        // the middle of the notification loop, where `this.subscription` will then be null. An
        // extra null check every change can be avoided by copying the method onto `this` and then
        // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
        // listeners logic is changed to not call listeners that have been unsubscribed in the
        // middle of the notification loop.
        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
      };

      Connect.prototype.onStateChange = function onStateChange() {
        this.selector.run(this.props);

        if (!this.selector.shouldComponentUpdate) {
          this.notifyNestedSubs();
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
          this.setState(dummyState);
        }
      };

      Connect.prototype.notifyNestedSubsOnComponentDidUpdate = function notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.
        this.componentDidUpdate = undefined;
        this.notifyNestedSubs();
      };

      Connect.prototype.isSubscribed = function isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed();
      };

      Connect.prototype.addExtraProps = function addExtraProps(props) {
        if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props;
        // make a shallow copy so that fields added don't leak to the original selector.
        // this is especially important for 'ref' since that's a reference back to the component
        // instance. a singleton memoized selector would then be holding a reference to the
        // instance, preventing the instance from being garbage collected, and that would be bad
        var withExtras = _extends$1({}, props);
        if (withRef) withExtras.ref = this.setWrappedInstance;
        if (renderCountProp) withExtras[renderCountProp] = this.renderCount++;
        if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription;
        return withExtras;
      };

      Connect.prototype.render = function render() {
        var selector = this.selector;
        selector.shouldComponentUpdate = false;

        if (selector.error) {
          throw selector.error;
        } else {
          return react_4(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(react_3);

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;
    Connect.propTypes = contextTypes;

    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        var _this2 = this;

        // We are hot reloading!
        if (this.version !== version) {
          this.version = version;
          this.initSelector();

          // If any connected descendants don't hot reload (and resubscribe in the process), their
          // listeners will be lost when we unsubscribe. Unfortunately, by copying over all
          // listeners, this does mean that the old versions of connected descendants will still be
          // notified of state changes; however, their onStateChange function is a no-op so this
          // isn't a huge deal.
          var oldListeners = [];

          if (this.subscription) {
            oldListeners = this.subscription.listeners.get();
            this.subscription.tryUnsubscribe();
          }
          this.initSubscription();
          if (shouldHandleStateChanges) {
            this.subscription.trySubscribe();
            oldListeners.forEach(function (listener) {
              return _this2.subscription.listeners.subscribe(listener);
            });
          }
        }
      };
    }

    return hoistNonReactStatics(Connect, WrappedComponent);
  };
}

var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var Symbol$1 = root.Symbol;

var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */
var root$2;

if (typeof self !== 'undefined') {
  root$2 = self;
} else if (typeof window !== 'undefined') {
  root$2 = window;
} else if (typeof global !== 'undefined') {
  root$2 = global;
} else if (typeof module !== 'undefined') {
  root$2 = module;
} else {
  root$2 = Function('return this')();
}

var result = symbolObservablePonyfill(root$2);

var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning$4(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning$4('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning$4(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning$4('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning$3(methodName + '() in ' + displayName + ' must return a plain object. Instead received ' + value + '.');
  }
}

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }
    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
// 
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
// 
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//    
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//    
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//    
function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    };

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (process.env.NODE_ENV !== 'production') verifyPlainObject(props, displayName, methodName);

      return props;
    };

    return proxy;
  };
}

function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}

function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
    return { dispatch: dispatch };
  }) : undefined;
}

function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? wrapMapToPropsConstant(function (dispatch) {
    return bindActionCreators(mapDispatchToProps, dispatch);
  }) : undefined;
}

var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];

function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}

function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}

var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];

var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends$3({}, ownProps, stateProps, dispatchProps);
}

function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;

    var hasRunOnce = false;
    var mergedProps = void 0;

    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;

        if (process.env.NODE_ENV !== 'production') verifyPlainObject(mergedProps, displayName, 'mergeProps');
      }

      return mergedProps;
    };
  };
}

function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}

var defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];

function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error('Unexpected value for ' + methodName + ' in ' + displayName + '.');
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!selector.hasOwnProperty('dependsOnOwnProps')) {
      warning$3('The selector for ' + methodName + ' of ' + displayName + ' did not specify a value for dependsOnOwnProps.');
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}

function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;

  var hasRunAtLeastOnce = false;
  var state = void 0;
  var ownProps = void 0;
  var stateProps = void 0;
  var dispatchProps = void 0;
  var mergedProps = void 0;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);

    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutProperties$1(_ref2, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (process.env.NODE_ENV !== 'production') {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}

var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$2(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error('Invalid value of type ' + typeof arg + ' for ' + name + ' argument when connecting component ' + options.wrappedComponentName + '.');
  };
}

function strictEqual(a, b) {
  return a === b;
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
function createConnect() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === undefined ? connectAdvanced : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === undefined ? defaultMapStateToPropsFactories : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === undefined ? defaultMapDispatchToPropsFactories : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === undefined ? defaultMergePropsFactories : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === undefined ? finalPropsSelectorFactory : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$pure = _ref2.pure,
        pure = _ref2$pure === undefined ? true : _ref2$pure,
        _ref2$areStatesEqual = _ref2.areStatesEqual,
        areStatesEqual = _ref2$areStatesEqual === undefined ? strictEqual : _ref2$areStatesEqual,
        _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual,
        areOwnPropsEqual = _ref2$areOwnPropsEqua === undefined ? shallowEqual : _ref2$areOwnPropsEqua,
        _ref2$areStatePropsEq = _ref2.areStatePropsEqual,
        areStatePropsEqual = _ref2$areStatePropsEq === undefined ? shallowEqual : _ref2$areStatePropsEq,
        _ref2$areMergedPropsE = _ref2.areMergedPropsEqual,
        areMergedPropsEqual = _ref2$areMergedPropsE === undefined ? shallowEqual : _ref2$areMergedPropsE,
        extraOptions = _objectWithoutProperties$2(_ref2, ['pure', 'areStatesEqual', 'areOwnPropsEqual', 'areStatePropsEqual', 'areMergedPropsEqual']);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');

    return connectHOC(selectorFactory, _extends$4({
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return 'Connect(' + name + ')';
      },

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual

    }, extraOptions));
  };
}

var connect = createConnect();

var Input = function (_PureComponent) {
	inherits(Input, _PureComponent);

	function Input() {
		classCallCheck(this, Input);
		return possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).apply(this, arguments));
	}

	createClass(Input, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.props.autoFocus) {
				this.input.focus();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    id = _props.id,
			    setValue = _props.setValue,
			    value = _props.value,
			    className = _props.className,
			    placeholder = _props.placeholder,
			    _props$tabIndex = _props.tabIndex,
			    tabIndex = _props$tabIndex === undefined ? -1 : _props$tabIndex;


			return react.createElement('input', {
				id: id,
				tabIndex: tabIndex,
				className: classnames('sparkling-input native-key-bindings', className),
				placeholder: placeholder,
				onInput: function onInput(event) {
					setValue(event.target.value);
				},
				value: value,
				ref: function ref(input) {
					_this2.input = input;
				}
			});
		}
	}]);
	return Input;
}(react_2);

var replaceRenderer = function replaceRenderer(_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept,
	    replace = _ref.replace;
	var start = item.start,
	    end = item.end,
	    value = item.value,
	    path$$1 = item.path;


	var wrappedValue = wrap(value, pattern, start, end, 'replace-downlight', '<span class="replace-highlight">' + escapeHTML(replace) + '</span>');

	var finalClassName = classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	return react.createElement('div', {
		className: finalClassName,
		'aria-role': 'button',
		onClick: function onClick() {
			return accept(item);
		},
		dangerouslySetInnerHTML: { __html: wrappedValue }
	});
};

var Replace = connect(function (state) {
	return {
		replace: getReplace(state)
	};
})(replaceRenderer);

var renderer$5 = (function (props) {
	return react.createElement(Replace, props);
});

var ReplaceInput = function ReplaceInput(_ref) {
	var value = _ref.value,
	    setValue = _ref.setValue;
	return react.createElement(Input, {
		autoFocus: true,
		tabIndex: 0,
		className: 'sparkling-replace',
		placeholder: 'Replace',
		setValue: setValue,
		value: value
	});
};

var ReplaceInputContainer = connect(function (state) {
	return {
		value: getReplace(state)
	};
}, function (dispatch) {
	return {
		setValue: function setValue(replace) {
			return dispatch({ type: 'SET_REPLACE', payload: { replace: replace } });
		}
	};
})(ReplaceInput);

var replace = (function (React, store) {
	var loadData = loadDataFactory$2(store);

	var accept = function accept(item) {
		var replace = getReplace(store.getState());
		var lineNumber = item.lineNumber,
		    path$$1 = item.path,
		    match = item.match,
		    column = item.column,
		    line = item.line;


		fileReplace({
			line: line,
			lineNumber: lineNumber,
			path: path$$1,
			column: column,
			match: match,
			replace: replace
		}).then(function () {
			store.dispatch({
				type: 'RELOAD'
			});
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$5,
		description: 'Replace pattern in project',
		id: 'sparkling-project-replace',
		sliceLength: 10,
		childrenRenderer: function childrenRenderer() {
			return React.createElement(ReplaceInputContainer, null);
		}
	};
});

var loadData$4 = (function (onData) {
	var cmdProcess = spawnInProject('rg', ['^.*$', '-n', '--max-filesize', '100K']);

	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').reduce(function (acc, value) {
			var _value$split = value.split(':'),
			    _value$split2 = toArray(_value$split),
			    path$$1 = _value$split2[0],
			    lineNumber = _value$split2[1],
			    splitLine = _value$split2.slice(2);

			var line = splitLine.join(':');

			if (line && line.length > 1 && line.length < 500) {
				acc.push({
					value: [path$$1, lineNumber, splitLine].join(' : '),
					path: path$$1,
					line: line,
					lineNumber: lineNumber
				});
			}
			return acc;
		}, []));
	});

	return function () {
		cmdProcess.stdout.pause();
		cmdProcess.kill();
	};
});

var allLines = (function (React, store) {
	var accept = function accept(line) {
		store.dispatch({ type: 'HIDE' });
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		});
	};

	return {
		loadData: loadData$4,
		accept: accept,
		description: 'Find lines in project',
		id: 'sparkling-project-lines'
	};
});

var autocompleteLines = (function (React, store) {
	var accept = function accept(item) {
		store.dispatch({ type: 'HIDE' });
		var editor = atom.workspace.getActiveTextEditor();
		editor.insertText(item.line);
	};

	return {
		loadData: loadData$4,
		accept: accept,
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	};
});

var config = {};

var SparklingInput = function SparklingInput(_ref) {
	var options = _ref.options,
	    data = _ref.data,
	    rawDataLength = _ref.rawDataLength,
	    pattern = _ref.pattern,
	    setPattern = _ref.setPattern;
	var description = options.description,
	    childrenRenderer = options.childrenRenderer;

	var filteredDataLength = data.length;

	return react.createElement(
		'div',
		{ className: 'sparkling-input-container' },
		react.createElement(
			'div',
			{ className: 'sparkling-meta-data' },
			react.createElement(
				'span',
				null,
				filteredDataLength + ' / ' + rawDataLength
			),
			react.createElement(
				'span',
				{ className: 'sparkling-command-description' },
				description
			)
		),
		react.createElement(Input, {
			autoFocus: true,
			id: 'sparkling-input',
			tabIndex: 1,
			className: classnames('sparkling-input', 'native-key-bindings', {
				'sparkling-input--has-results': filteredDataLength > 0,
				'sparkling-input--no-results': filteredDataLength === 0 && rawDataLength > 0
			}),
			placeholder: 'Sparkling fuzzy filter',
			value: pattern,
			setValue: setPattern
		}),
		childrenRenderer && childrenRenderer()
	);
};

var SparklingInput$1 = connect(function (state) {
	return {
		data: getSparklingData(state),
		options: getOptions(state),
		rawDataLength: getRawDataLength(state),
		pattern: getPattern(state)
	};
}, function (dispatch) {
	return {
		setPattern: function setPattern(pattern) {
			return dispatch({ type: 'SET_PATTERN', payload: { pattern: pattern } });
		}
	};
})(SparklingInput);

var SparklingResults = function SparklingResults(_ref) {
	var options = _ref.options,
	    selectedValue = _ref.selectedValue,
	    data = _ref.data,
	    selectedIndex = _ref.selectedIndex,
	    offset = _ref.offset,
	    pattern = _ref.pattern;
	var preview = options.preview,
	    renderer = options.renderer,
	    accept = options.accept,
	    columns = options.columns,
	    sliceLength = options.sliceLength;

	var style = columns > 1 ? {
		'grid-auto-columns': 'minmax(' + 100.0 / columns + '%, 100%)',
		'grid-auto-flow': 'column',
		'grid-template-rows': 'repeat(' + sliceLength / columns + ', 1fr)'
	} : {
		'grid-auto-flow': 'row'
	};

	return react.createElement(
		'div',
		{ className: 'sparkling-results-container' },
		react.createElement(
			'div',
			{ className: 'sparkling-results', style: style },
			data.slice(offset, offset + sliceLength).map(function (item, index) {
				return renderer({
					item: item,
					index: index,
					selectedIndex: selectedIndex,
					accept: accept,
					pattern: pattern
				});
			})
		),
		preview && selectedValue && react.createElement(
			'div',
			{ className: 'sparkling-preview' },
			preview(selectedValue)
		)
	);
};

var SparklingResults$1 = connect(function (state) {
	return {
		options: getOptions(state),
		data: getSparklingData(state),
		selectedIndex: getIndex(state),
		selectedValue: getSelectedValue(state),
		offset: getOffset(state),
		pattern: getPattern(state)
	};
})(SparklingResults);

var Sparkling = (function (_ref) {
	var options = _ref.options;
	var id = options.id;


	return react.createElement(
		'div',
		{ className: 'sparkling', id: id },
		react.createElement(SparklingResults$1, null),
		react.createElement(SparklingInput$1, null)
	);
});

var SparklingContainer = function SparklingContainer(_ref) {
	var visible = _ref.visible,
	    props = objectWithoutProperties(_ref, ['visible']);

	if (!visible) {
		return null;
	}

	return react.createElement(Sparkling, props);
};

var SparklingContainer$1 = connect(function (state) {
	return {
		visible: isVisible(state),
		options: getOptions(state)
	};
})(SparklingContainer);

var FindContainer = function FindContainer(_ref) {
	var visible = _ref.visible,
	    value = _ref.value,
	    setValue = _ref.setValue,
	    toggleSmartCase = _ref.toggleSmartCase,
	    smartCase = _ref.smartCase,
	    scope = _ref.scope,
	    setScope = _ref.setScope,
	    toggleLiteralSearch = _ref.toggleLiteralSearch,
	    literalSearch = _ref.literalSearch;

	if (!visible) {
		return null;
	}

	return react.createElement(
		'div',
		{ className: 'sparkling-input-container' },
		react.createElement(
			'div',
			{ className: 'sparkling-find-options' },
			react.createElement(
				'button',
				{
					onClick: toggleSmartCase,
					className: classnames('sparkling-toggle', defineProperty({}, 'sparkling-toggle-active', smartCase))
				},
				'Smart case'
			),
			react.createElement(
				'button',
				{
					onClick: toggleLiteralSearch,
					className: classnames('sparkling-toggle', defineProperty({}, 'sparkling-toggle-active', literalSearch))
				},
				'Literal search'
			)
		),
		react.createElement(Input, {
			tabIndex: 0,
			className: 'sparkling-find',
			autoFocus: true,
			value: value,
			setValue: setValue,
			placeholder: 'Enter to find, shift Enter to replace'
		}),
		react.createElement(Input, {
			tabIndex: 1,
			className: 'sparkling-scope',
			value: scope,
			setValue: setScope,
			placeholder: 'Scope. Leave empty to search whole project'
		})
	);
};

var FindContainer$1 = connect(function (state) {
	return {
		visible: isFindVisible(state),
		value: getFind(state),
		smartCase: isSmartCase(state),
		literalSearch: isLiteralSearch(state),
		scope: getScope(state),
		wholeWord: isWholeWord(state)
	};
}, function (dispatch) {
	return {
		setValue: function setValue(find) {
			return dispatch({ type: 'SET_SEARCH', payload: { find: find } });
		},
		toggleSmartCase: function toggleSmartCase() {
			return dispatch({ type: 'TOGGLE_SMART_CASE' });
		},
		toggleLiteralSearch: function toggleLiteralSearch() {
			return dispatch({ type: 'TOGGLE_LITERAL_SEARCH' });
		},
		setScope: function setScope(scope) {
			return dispatch({ type: 'SET_SCOPE', payload: { scope: scope } });
		},
		toggleWholeWord: function toggleWholeWord() {
			return dispatch({ type: 'TOGGLE_WHOLE_WORD' });
		}
	};
})(FindContainer);

var ExtraInputContainer = function ExtraInputContainer(_ref) {
	var extraInput = _ref.extraInput,
	    setValue = _ref.setValue;
	var value = extraInput.value,
	    id = extraInput.id,
	    _extraInput$placehold = extraInput.placeholder,
	    placeholder = _extraInput$placehold === undefined ? '' : _extraInput$placehold;

	if (!id) {
		return null;
	}

	return react.createElement(
		'div',
		{ id: id, className: 'sparkling-input-container' },
		react.createElement(Input, {
			autoFocus: true,
			value: value,
			setValue: setValue,
			placeholder: placeholder
		})
	);
};

var ExtraInputContainer$1 = connect(function (state) {
	return {
		extraInput: getExtraInput(state)
	};
}, function (dispatch) {
	return {
		setValue: function setValue(value) {
			return dispatch({ type: 'SET_EXTRA_INPUT_VALUE', payload: { value: value } });
		}
	};
})(ExtraInputContainer);

var render = (function (root, dependencies) {
	var _require = require('react-dom'),
	    render = _require.render;

	var store = dependencies.store;


	render(react.createElement(
		Provider,
		{ store: store },
		react.createElement(
			'div',
			null,
			react.createElement(SparklingContainer$1, null),
			react.createElement(FindContainer$1, null),
			react.createElement(ExtraInputContainer$1, null)
		)
	), root);
});

var reducerCreator = function reducerCreator(actions) {
	return function (initialState) {
		return function () {
			var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
			var _ref = arguments[1];
			var type = _ref.type,
			    payload = _ref.payload;

			var action = actions[type];

			if (action !== null && action !== undefined) {
				return typeof action === 'function' ? action(state, payload) : action;
			}

			return state;
		};
	};
};

var returnPayload = function returnPayload(field) {
	return function (state, payload) {
		return field ? payload[field] : payload;
	};
};

var visible = reducerCreator({
	SHOW: true,
	HIDE: false,
	SHOW_SEARCH: false,
	SHOW_INPUT: false
})(false);

var findVisible = reducerCreator({
	SHOW_SEARCH: true,
	SHOW: false,
	HIDE: false
})(false);

var find$1 = reducerCreator({
	SHOW_SEARCH: returnPayload('find'),
	SET_SEARCH: returnPayload('find')
})('');

var replace$1 = reducerCreator({
	SHOW_SEARCH: '',
	SET_REPLACE: returnPayload('replace')
})('');

var options = reducerCreator({
	SHOW: returnPayload()
})({});

var data = reducerCreator({
	APPEND_DATA: function APPEND_DATA(state, _ref2) {
		var data = _ref2.data;
		return state.concat(data);
	},
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: function REMOVE_ITEM(state, item) {
		return state.filter(function (x) {
			return x !== item;
		});
	}
})([]);

var sparklingData = reducerCreator({
	SET_FILTERED_DATA: returnPayload('data'),
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: function REMOVE_ITEM(state, item) {
		return state.filter(function (x) {
			return x !== item;
		});
	}
})([]);

var pattern = reducerCreator({
	SET_PATTERN: function SET_PATTERN(state, _ref3) {
		var pattern = _ref3.pattern;
		return _extends({}, state, { value: pattern });
	},
	SHOW: function SHOW(state) {
		return _extends({}, state, { value: '' });
	}
})({ value: '', id: '' });

var index = reducerCreator({
	SET_INDEX: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0,
	REMOVE_ITEM: 0
})(0);

var offset = reducerCreator({
	SET_OFFSET: returnPayload('value'),
	SET_DATA: 0,
	SET_PATTERN: 0,
	SHOW: 0
})(0);

var extraInput = reducerCreator({
	SHOW_INPUT: returnPayload(),
	SET_EXTRA_INPUT_VALUE: function SET_EXTRA_INPUT_VALUE(state, _ref4) {
		var value = _ref4.value;
		return _extends({}, state, { value: value });
	},
	HIDE: { value: '', id: null }
})({ value: '', id: null });

var smartCase = reducerCreator({
	TOGGLE_SMART_CASE: function TOGGLE_SMART_CASE(state) {
		return !state;
	}
})(true);

var literalSearch = reducerCreator({
	TOGGLE_LITERAL_SEARCH: function TOGGLE_LITERAL_SEARCH(state) {
		return !state;
	}
})(false);

var wholeWord = reducerCreator({
	TOGGLE_WHOLE_WORD: function TOGGLE_WHOLE_WORD(state) {
		return !state;
	}
})(false);

var scope = reducerCreator({
	SHOW_SEARCH: returnPayload('scope'),
	SET_SCOPE: returnPayload('scope')
})('');

var reducers = combineReducers({
	visible: visible,
	options: options,
	data: data,
	sparklingData: sparklingData,
	index: index,
	offset: offset,
	pattern: pattern,
	findVisible: findVisible,
	find: find$1,
	replace: replace$1,
	extraInput: extraInput,
	smartCase: smartCase,
	literalSearch: literalSearch,
	scope: scope,
	wholeWord: wholeWord
});

var fromSelectorFactory = function fromSelectorFactory(store, Observable) {
	return function (selector) {
		return Observable.create(function (observer) {
			return store.subscribe(function () {
				var state = store.getState();
				var selectedState = selector(state);
				observer.next(selectedState);
			});
		}).distinctUntilChanged();
	};
};

var fromActionFactory = function fromActionFactory(store, Observable) {
	var oldDispatch = store.dispatch;

	var subscriptions = new Set();

	var subscribe = function subscribe(event) {
		subscriptions.add(event);

		return function () {
			subscriptions.delete(event);
		};
	};

	var newDispatch = function newDispatch(action) {
		// console.log('action: ', action)
		if (typeof action === 'function') {
			action(newDispatch, store.getState);
		} else {
			// console.log('action: ', action)
			oldDispatch(action);

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = subscriptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var subscription = _step.value;
					var actionType = subscription.actionType,
					    observer = subscription.observer;


					if (actionType === action.type) {
						observer.next(actionType);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	};

	store.dispatch = newDispatch;

	return function (actionType) {
		return Observable.create(function (observer) {
			return subscribe({ actionType: actionType, observer: observer });
		});
	};
};

function storeFactory(Observable) {
	var store = createStore(reducers);
	var fromAction = fromActionFactory(store, Observable);
	var fromSelector = fromSelectorFactory(store, Observable);
	store.fromSelector = fromSelector;
	store.fromAction = fromAction;
	// store.subscribe(() => {
	// 	console.log(store.getState())
	// })

	return store;
}

var setupObservables = (function (store, Observable) {
	var fromSelector = store.fromSelector,
	    fromAction = store.fromAction;


	var cancelLoadData = null;

	fromSelector(getSelectedValue).debounceTime(100).subscribe(function (selectedValue) {
		var options = getOptions(store.getState());
		var onValue = options.onValue;

		onValue && onValue(selectedValue);
	});

	Observable.combineLatest(fromSelector(getData), fromSelector(getPattern)).auditTime(100).subscribe(function (_ref) {
		var _ref2 = slicedToArray(_ref, 2),
		    data = _ref2[0],
		    pattern = _ref2[1];

		if (!pattern.length && (!data || !data.length)) {
			return;
		}

		if (!pattern.length) {
			store.dispatch({
				type: 'SET_FILTERED_DATA',
				payload: { data: data }
			});
		} else {
			fuzzyFilter(pattern, data).then(function (filteredData) {
				store.dispatch({
					type: 'SET_FILTERED_DATA',
					payload: { data: filteredData }
				});
			});
		}
	});

	Observable.merge(fromAction('RELOAD'), fromAction('SHOW')).subscribe(function () {
		var options = getOptions(store.getState());

		var loadData = options.loadData;


		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData();
		}

		cancelLoadData = loadData(function (data) {
			store.dispatch({
				type: 'APPEND_DATA',
				payload: {
					data: data
				}
			});
		});
	});

	fromAction('HIDE').subscribe(function () {
		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData();
			cancelLoadData = null;
		}
	});
});

var next = function next() {
	return function (dispatch, getState) {
		var state = getState();
		var index = getIndex(state);
		var sparklingData = getSparklingData(state);
		var options = getOptions(state);
		var sliceLength = options.sliceLength;


		if (index === sliceLength - 1) {
			var offset = getOffset(state);
			var value = Math.min(offset + 1, sparklingData.length - sliceLength);
			dispatch({ type: 'SET_OFFSET', payload: { value: value } });
		} else {
			var _value = Math.min(index + 1, sparklingData.length - 1, sliceLength - 1);
			dispatch({ type: 'SET_INDEX', payload: { value: _value } });
		}
	};
};

var previous = function previous() {
	return function (dispatch, getState) {
		var state = getState();
		var index = getIndex(state);

		if (index === 0) {
			var offset = getOffset(state);
			var value = Math.max(offset - 1, 0);
			dispatch({ type: 'SET_OFFSET', payload: { value: value } });
		} else {
			var _value2 = Math.max(index - 1, 0);
			dispatch({ type: 'SET_INDEX', payload: { value: _value2 } });
		}
	};
};

var left = function left() {
	return function (dispatch, getState) {
		var state = getState();
		var index = getIndex(state);
		var options = getOptions(state);
		var columns = options.columns,
		    sliceLength = options.sliceLength;

		var rows = sliceLength / columns;

		if (index === 0) {
			var offset = getOffset(state);
			var value = Math.max(offset - rows, 0);
			dispatch({ type: 'SET_OFFSET', payload: { value: value } });
		} else {
			var _value3 = Math.max(index - rows, 0);
			dispatch({ type: 'SET_INDEX', payload: { value: _value3 } });
		}
	};
};

var right = function right() {
	return function (dispatch, getState) {
		var state = getState();
		var index = getIndex(state);
		var sparklingData = getSparklingData(state);
		var options = getOptions(state);
		var sliceLength = options.sliceLength,
		    columns = options.columns;

		var rows = sliceLength / columns;

		if (index === sliceLength - 1) {
			var offset = getOffset(state);
			var value = Math.min(offset + rows, sparklingData.length - sliceLength);
			dispatch({ type: 'SET_OFFSET', payload: { value: value } });
		} else {
			var _value4 = Math.min(index + rows, sparklingData.length - 1, sliceLength - 1);
			dispatch({ type: 'SET_INDEX', payload: { value: _value4 } });
		}
	};
};

var hide = function hide() {
	return function (dispatch) {
		dispatch({ type: 'HIDE' });
	};
};

var accept = function accept() {
	return function (dispatch, getState) {
		var state = getState();
		var value = getSelectedValue(state);

		if (value === null || value === undefined) {
			return;
		}

		var _getOptions = getOptions(state),
		    accept = _getOptions.accept;

		accept(value);
	};
};

var findToggle = function findToggle() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    find = _ref.find,
	    scope = _ref.scope;

	return function (dispatch, getState) {
		var findInput = document.querySelector('#sparkling-project-find #sparkling-input');
		var replaceInput = document.querySelector('#sparkling-project-replace #sparkling-input');

		if (findInput && findInput !== document.activeElement) {
			findInput.focus();
		} else if (replaceInput && replaceInput !== document.activeElement) {
			replaceInput.focus();
		} else if (isFindVisible(getState())) {
			dispatch({ type: 'HIDE' });
		} else {
			dispatch({ type: 'SHOW_SEARCH', payload: { find: find, scope: scope } });
		}
	};
};

var copyFilesConfirm = function copyFilesConfirm(onDone) {
	return function (dispatch, getState) {
		var extraInput = getExtraInput(getState());
		var cmdProcess = spawnInProject('cp', [extraInput.originPath, extraInput.value]);
		cmdProcess.on('exit', function () {
			return onDone(extraInput);
		});
	};
};

var moveFilesConfirm = function moveFilesConfirm(onDone) {
	return function (dispatch, getState) {
		var extraInput = getExtraInput(getState());
		var cmdProcess = spawnInProject('mv', [extraInput.originPath, extraInput.value]);
		cmdProcess.on('exit', function () {
			return onDone(extraInput);
		});
	};
};

module.exports = {
	subscriptions: null,

	config: config,

	provideSparkling: function provideSparkling() {
		return this.commandFactory;
	},
	bootstrap: function bootstrap() {
		var _require = require('rxjs/Observable'),
		    Observable = _require.Observable;

		require('rxjs/add/observable/combineLatest');
		require('rxjs/add/observable/merge');
		require('rxjs/add/operator/auditTime');
		require('rxjs/add/operator/debounceTime');
		require('rxjs/add/operator/distinctUntilChanged');

		var store = storeFactory(Observable);

		setupObservables(store, Observable);

		this.commandFactory = commandFactoryFactory(store);

		var fromAction = store.fromAction;


		fromAction('HIDE').subscribe(function () {
			var editor = atom.workspace.getActiveTextEditor();
			var view = editor && atom.views.getView(editor);
			view && view.focus();
		});

		var reactRoot = document.createElement('div');

		var dependencies = { store: store, commandFactory: this.commandFactory };

		render(reactRoot, dependencies);

		atom.workspace.addBottomPanel({ item: reactRoot, model: {} });

		var filesCommand = this.commandFactory(files);
		var gitFilesCommand = this.commandFactory(gitFiles);
		var gitStageCommand = this.commandFactory(gitStage);
		var gitBranchesCommand = this.commandFactory(gitBranches);
		var gitLogCommand = this.commandFactory(gitLog);
		var gitLogCheckoutCommand = this.commandFactory(gitLogCheckout);
		var gitCheckoutCommand = this.commandFactory(gitCheckout);
		var gitReflogCommand = this.commandFactory(gitReflog);
		var gitReflogCheckoutCommand = this.commandFactory(gitReflogCheckout);
		var linesCommand = this.commandFactory(lines);
		var allLinesCommand = this.commandFactory(allLines);
		var autocompleteLinesCommand = this.commandFactory(autocompleteLines);
		var findCommand = this.commandFactory(find);
		var replaceCommand = this.commandFactory(replace);
		var removeFilesCommand = this.commandFactory(removeFiles);
		var moveFilesCommand = this.commandFactory(moveFiles);
		var copyFilesCommand = this.commandFactory(copyFiles);
		var lsCommand = this.commandFactory(ls);

		var onDone = function onDone(extraInput) {
			store.dispatch({ type: 'HIDE' });
			atom.workspace.open(extraInput.value);
		};

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'sparkling:files': filesCommand,
			'sparkling:gitFiles': gitFilesCommand,
			'sparkling:gitStage': gitStageCommand,
			'sparkling:gitBranches': gitBranchesCommand,
			'sparkling:gitLog': gitLogCommand,
			'sparkling:gitLogCheckout': gitLogCheckoutCommand,
			'sparkling:gitCheckout': gitCheckoutCommand,
			'sparkling:gitReflog': gitReflogCommand,
			'sparkling:gitReflogCheckout': gitReflogCheckoutCommand,
			'sparkling:lines': linesCommand,
			'sparkling:allLines': allLinesCommand,
			'sparkling:autocompleteLines': autocompleteLinesCommand,
			'sparkling:find': findCommand,
			'sparkling:replace': replaceCommand,
			'sparkling:removeFiles': removeFilesCommand,
			'sparkling:moveFiles': moveFilesCommand,
			'sparkling:copyFiles': copyFilesCommand,
			'sparkling:next': function sparklingNext() {
				return store.dispatch(next());
			},
			'sparkling:previous': function sparklingPrevious() {
				return store.dispatch(previous());
			},
			'sparkling:left': function sparklingLeft() {
				return store.dispatch(left());
			},
			'sparkling:right': function sparklingRight() {
				return store.dispatch(right());
			},
			'sparkling:accept': function sparklingAccept() {
				return store.dispatch(accept());
			},
			'sparkling:hide': function sparklingHide() {
				return store.dispatch(hide());
			},
			'sparkling:ls': function sparklingLs() {
				var activeTextEditor = atom.workspace.getActiveTextEditor();
				var finalPath = activeTextEditor ? path.dirname(activeTextEditor.getPath()) : atom.project.getPaths()[0];

				lsCommand({ path: finalPath, description: finalPath, lsCommand: lsCommand });
			},
			'sparkling:lsUp': function sparklingLsUp() {
				var _getOptions = getOptions(store.getState()),
				    optionsPath = _getOptions.path;

				var finalPath = path.resolve(optionsPath, '..');

				lsCommand({ path: finalPath, description: finalPath, lsCommand: lsCommand });
			},
			'sparkling:moveFilesConfirm': function sparklingMoveFilesConfirm() {
				return store.dispatch(moveFilesConfirm(onDone));
			},
			'sparkling:copyFilesConfirm': function sparklingCopyFilesConfirm() {
				return store.dispatch(copyFilesConfirm(onDone));
			},
			'sparkling:findToggle': function sparklingFindToggle() {
				var editor = atom.workspace.getActiveTextEditor();
				var find$$1 = editor ? editor.getSelectedText() : '';
				var scope = '';

				store.dispatch(findToggle({ find: find$$1, scope: scope }));
			},
			'sparkling:findInBufferToggle': function sparklingFindInBufferToggle() {
				var editor = atom.workspace.getActiveTextEditor();
				var find$$1 = editor ? editor.getSelectedText() : '';
				var cwd = atom.project.getPaths()[0];
				var scope = editor ? editor.getPath().replace(cwd, '') : '';

				store.dispatch(findToggle({ find: find$$1, scope: scope }));
			}
		}));
	},
	activate: function activate() {
		var _this = this;

		this.subscriptions = new atom$1.CompositeDisposable();

		if (atom.packages.hasActivatedInitialPackages()) {
			this.bootstrap();
		} else {
			this.subscriptions.add(atom.packages.onDidActivateInitialPackages(function () {
				return _this.bootstrap();
			}));
		}
	},
	deactivate: function deactivate() {
		this.subscriptions.dispose();
		this.subscriptions = null;
	},
	serialize: function serialize() {
		return {};
	},
	consumeFileIcons: function consumeFileIcons(service) {
		setFileIconsService(service);
	}
};
