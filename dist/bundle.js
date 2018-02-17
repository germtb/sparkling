'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var child_process = require('child_process');
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var atom$1 = require('atom');

/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/**
 * JSX/hyperscript reviver.
 * @see http://jasonformat.com/wtf-is-jsx
 * Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *
 * Note: this is exported as both `h()` and `createElement()` for compatibility reasons.
 *
 * Creates a VNode (virtual DOM element). A tree of VNodes can be used as a lightweight representation
 * of the structure of a DOM tree. This structure can be realized by recursively comparing it against
 * the current _actual_ DOM structure, and applying only the differences.
 *
 * `h()`/`createElement()` accepts an element name, a list of attributes/props,
 * and optionally children to append to the element.
 *
 * @example The following DOM tree
 *
 * `<div id="foo" name="bar">Hello!</div>`
 *
 * can be constructed using this function as:
 *
 * `h('div', { id: 'foo', name : 'bar' }, 'Hello!');`
 *
 * @param {string} nodeName	An element name. Ex: `div`, `a`, `span`, etc.
 * @param {Object} attributes	Any attributes/props to set on the created element.
 * @param rest			Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
 *
 * @public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/**
 *  Copy all properties from `props` onto `obj`.
 *  @param {Object} obj		Object onto which properties should be copied.
 *  @param {Object} props	Object from which to copy properties.
 *  @returns obj
 *  @private
 */
function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

/**
 * Call a function asynchronously, as soon as possible. Makes
 * use of HTML Promise to schedule the callback if available,
 * otherwise falling back to `setTimeout` (mainly for IE<11).
 *
 * @param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {VNode} vnode		The virutal DOM element to clone
 * @param {Object} props	Attributes/props to add when cloning
 * @param {VNode} rest		Any additional arguments will be used as replacement children.
 */
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/**
 * Check if two nodes are equivalent.
 *
 * @param {Node} node			DOM Node to compare
 * @param {VNode} vnode			Virtual DOM node to compare
 * @param {boolean} [hyrdating=false]	If true, ignores component constructors when comparing.
 * @private
 */
function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }
  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }
  return hydrating || node._componentConstructor === vnode.nodeName;
}

/**
 * Check if an Element has a given nodeName, case-insensitively.
 *
 * @param {Element} node	A DOM Element to inspect the name of.
 * @param {String} nodeName	Unnormalized name to compare against.
 */
function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 *
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;

  var defaultProps = vnode.nodeName.defaultProps;
  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}


//# sourceMappingURL=preact.esm.js.map

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var Symbol$1 = root.Symbol;

var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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
  var isOwn = hasOwnProperty.call(value, symToStringTag),
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
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

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
  var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
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
function warning(message) {
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
        warning('No reducer provided for key "' + key + '"');
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
        warning(warningMessage);
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
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

var Children = {
	only: function only(children) {
		return children && children[0] || null;
	}
};

function proptype() {}
proptype.isRequired = proptype;

var PropTypes = {
	element: proptype,
	func: proptype,
	shape: function shape() {
		return proptype;
	},
	instanceOf: function instanceOf() {
		return proptype;
	}
};

var subscriptionShape = PropTypes.shape({
  trySubscribe: PropTypes.func.isRequired,
  tryUnsubscribe: PropTypes.func.isRequired,
  notifyNestedSubs: PropTypes.func.isRequired,
  isSubscribed: PropTypes.func.isRequired
});

var storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning$1(message) {
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends$1 = Object.assign || function (target) {
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

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  warning$1('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

function createProvider() {
  var _Provider$childContex;

  var storeKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'store';
  var subKey = arguments[1];

  var subscriptionKey = subKey || storeKey + 'Subscription';

  var Provider = function (_Component) {
    inherits(Provider, _Component);

    Provider.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
    };

    function Provider(props, context) {
      classCallCheck(this, Provider);

      var _this = possibleConstructorReturn(this, _Component.call(this, props, context));

      _this[storeKey] = props.store;
      return _this;
    }

    Provider.prototype.render = function render$$1() {
      return Children.only(this.props.children);
    };

    return Provider;
  }(Component);

  {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      if (this[storeKey] !== nextProps.store) {
        warnAboutReceivingStore();
      }
    };
  }

  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = storeShape.isRequired, _Provider$childContex[subscriptionKey] = subscriptionShape, _Provider$childContex);

  return Provider;
}

var Provider = createProvider();

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
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

var defineProperty$1 = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

var hoistNonReactStatics = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components

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
                try {
                    // Avoid failures from read-only properties
                    defineProperty$1(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

var invariant = function () {};

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
    get: function get$$1() {
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
    classCallCheck(this, Subscription);

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

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref$getDisplayName = _ref.getDisplayName,
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
      connectOptions = objectWithoutProperties(_ref, ['getDisplayName', 'methodName', 'renderCountProp', 'shouldHandleStateChanges', 'storeKey', 'withRef']);

  var subscriptionKey = storeKey + 'Subscription';
  var version = hotReloadingVersion++;

  var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = storeShape, _contextTypes[subscriptionKey] = subscriptionShape, _contextTypes);
  var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = subscriptionShape, _childContextTypes);

  return function wrapWithConnect(WrappedComponent) {
    invariant(typeof WrappedComponent == 'function', 'You must pass a component to the function returned by ' + ('connect. Instead received ' + JSON.stringify(WrappedComponent)));

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
      inherits(Connect, _Component);

      function Connect(props, context) {
        classCallCheck(this, Connect);

        var _this = possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.version = version;
        _this.state = {};
        _this.renderCount = 0;
        _this.store = props[storeKey] || context[storeKey];
        _this.propsMode = Boolean(props[storeKey]);
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);

        invariant(_this.store, 'Could not find "' + storeKey + '" in either the context or props of ' + ('"' + displayName + '". Either wrap the root component in a <Provider>, ') + ('or explicitly pass "' + storeKey + '" as a prop to "' + displayName + '".'));

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

      Connect.prototype.render = function render$$1() {
        var selector = this.selector;
        selector.shouldComponentUpdate = false;

        if (selector.error) {
          throw selector.error;
        } else {
          return h(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(Component);

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;


    {
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

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
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
var freeGlobal$2 = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf$1 = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$3 = freeGlobal$2 || freeSelf$1 || Function('return this')();

/** Built-in value references. */
var _Symbol = root$3.Symbol;

/** Used for built-in method references. */
var objectProto$1$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1$1 = objectProto$1$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$2 = objectProto$1$1.toString;

/** Built-in value references. */
var symToStringTag$1$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$2(value) {
  var isOwn = hasOwnProperty$1$1.call(value, symToStringTag$1$1),
      tag = value[symToStringTag$1$1];

  try {
    value[symToStringTag$1$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$2.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1$1] = tag;
    } else {
      delete value[symToStringTag$1$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$2$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1$1 = objectProto$2$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$2(value) {
  return nativeObjectToString$1$1.call(value);
}

/** `Object#toString` result references. */
var nullTag$1 = '[object Null]';
var undefinedTag$1 = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$2 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$2(value) {
    if (value == null) {
        return value === undefined ? undefinedTag$1 : nullTag$1;
    }
    return symToStringTag$2 && symToStringTag$2 in Object(value) ? getRawTag$2(value) : objectToString$2(value);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$2(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Built-in value references. */
var getPrototype$2 = overArg$2(Object.getPrototypeOf, Object);

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
function isObjectLike$2(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/** `Object#toString` result references. */
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
var objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString$1 = funcToString$1.call(Object);

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
function isPlainObject$2(value) {
  if (!isObjectLike$2(value) || baseGetTag$2(value) != objectTag$1) {
    return false;
  }
  var proto = getPrototype$2(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$1.call(Ctor) == objectCtorString$1;
}

function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject$2(value)) {
    warning$1(methodName + '() in ' + displayName + ' must return a plain object. Instead received ' + value + '.');
  }
}

function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options$$1) {
    var constant = getConstant(dispatch, options$$1);

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

      verifyPlainObject(props, displayName, methodName);

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
  return mapDispatchToProps && (typeof mapDispatchToProps === 'undefined' ? 'undefined' : _typeof(mapDispatchToProps)) === 'object' ? wrapMapToPropsConstant(function (dispatch) {
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

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends$1({}, ownProps, stateProps, dispatchProps);
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

        verifyPlainObject(mergedProps, displayName, 'mergeProps');
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
      warning$1('The selector for ' + methodName + ' of ' + displayName + ' did not specify a value for dependsOnOwnProps.');
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}

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
      options$$1 = objectWithoutProperties(_ref2, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']);

  var mapStateToProps = initMapStateToProps(dispatch, options$$1);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options$$1);
  var mergeProps = initMergeProps(dispatch, options$$1);

  {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options$$1.displayName);
  }

  var selectorFactory = options$$1.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options$$1);
}

/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options$$1) {
    throw new Error('Invalid value of type ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) + ' for ' + name + ' argument when connecting component ' + options$$1.wrappedComponentName + '.');
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
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var _ref2$pure = _ref2.pure,
        pure = _ref2$pure === undefined ? true : _ref2$pure,
        _ref2$areStatesEqual = _ref2.areStatesEqual,
        areStatesEqual = _ref2$areStatesEqual === undefined ? strictEqual : _ref2$areStatesEqual,
        _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual,
        areOwnPropsEqual = _ref2$areOwnPropsEqua === undefined ? shallowEqual : _ref2$areOwnPropsEqua,
        _ref2$areStatePropsEq = _ref2.areStatePropsEqual,
        areStatePropsEqual = _ref2$areStatePropsEq === undefined ? shallowEqual : _ref2$areStatePropsEq,
        _ref2$areMergedPropsE = _ref2.areMergedPropsEqual,
        areMergedPropsEqual = _ref2$areMergedPropsE === undefined ? shallowEqual : _ref2$areMergedPropsE,
        extraOptions = objectWithoutProperties(_ref2, ['pure', 'areStatesEqual', 'areOwnPropsEqual', 'areStatePropsEqual', 'areMergedPropsEqual']);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');

    return connectHOC(selectorFactory, _extends$1({
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


//# sourceMappingURL=preact-redux.esm.js.map

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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

var classCallCheck$1 = function (instance, Constructor) {
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

var _extends$2 = Object.assign || function (target) {
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



var inherits$1 = function (subClass, superClass) {
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









var objectWithoutProperties$1 = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn$1 = function (self, call) {
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













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Input = function (_Component) {
	inherits$1(Input, _Component);

	function Input() {
		classCallCheck$1(this, Input);
		return possibleConstructorReturn$1(this, (Input.__proto__ || Object.getPrototypeOf(Input)).apply(this, arguments));
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
		value: function render$$1() {
			var _this2 = this;

			var _props = this.props,
			    id = _props.id,
			    setValue = _props.setValue,
			    value = _props.value,
			    className = _props.className,
			    placeholder = _props.placeholder,
			    _props$tabIndex = _props.tabIndex,
			    tabIndex = _props$tabIndex === undefined ? -1 : _props$tabIndex;


			return h('input', {
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
}(Component);

var SparklingInput = function SparklingInput(_ref) {
	var options$$1 = _ref.options,
	    data = _ref.data,
	    rawDataLength = _ref.rawDataLength,
	    pattern = _ref.pattern,
	    setPattern = _ref.setPattern;
	var description = options$$1.description,
	    childrenRenderer = options$$1.childrenRenderer;

	var filteredDataLength = data.length;

	return h(
		'div',
		{ className: 'sparkling-input-container' },
		h(
			'div',
			{ className: 'sparkling-meta-data' },
			h(
				'span',
				null,
				filteredDataLength + ' / ' + rawDataLength
			),
			h(
				'span',
				{ className: 'sparkling-command-description' },
				description
			)
		),
		h(Input, {
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
	var options$$1 = _ref.options,
	    selectedValue = _ref.selectedValue,
	    data = _ref.data,
	    selectedIndex = _ref.selectedIndex,
	    offset = _ref.offset,
	    pattern = _ref.pattern;
	var preview = options$$1.preview,
	    renderer = options$$1.renderer,
	    accept = options$$1.accept;


	return h(
		'div',
		{ className: 'sparkling-results-container' },
		h(
			'div',
			{ className: 'sparkling-results' },
			data.slice(offset, offset + 10).map(function (item, index$$1) {
				return renderer({
					item: item,
					index: index$$1,
					selectedIndex: selectedIndex,
					accept: accept,
					pattern: pattern
				});
			})
		),
		preview && selectedValue && h(
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
	var options$$1 = _ref.options;
	var id = options$$1.id;


	return h(
		'div',
		{ className: 'sparkling', id: id },
		h(SparklingResults$1, null),
		h(SparklingInput$1, null)
	);
});

var SparklingContainer = function SparklingContainer(_ref) {
	var visible = _ref.visible,
	    props = objectWithoutProperties$1(_ref, ['visible']);

	if (!visible) {
		return null;
	}

	return h(Sparkling, props);
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
	    setValue = _ref.setValue;

	if (!visible) {
		return null;
	}

	return h(
		'div',
		{ className: 'sparkling-input-container' },
		h(Input, {
			className: 'sparking-find',
			autoFocus: true,
			value: value,
			setValue: setValue,
			placeholder: 'Enter to find, shift Enter to replace'
		})
	);
};

var FindContainer$1 = connect(function (state) {
	return {
		visible: isFindVisible(state),
		value: getFind(state)
	};
}, function (dispatch) {
	return {
		setValue: function setValue(find) {
			return dispatch({ type: 'SET_SEARCH', payload: { find: find } });
		}
	};
})(FindContainer);

var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof commonjsGlobal !== 'undefined' && commonjsGlobal;
var _root = __window || __global || __self;
var root_1 = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();
//# sourceMappingURL=root.js.map

var root$4 = {
	root: root_1
};

function isFunction(x) {
    return typeof x === 'function';
}
var isFunction_2 = isFunction;
//# sourceMappingURL=isFunction.js.map

var isFunction_1 = {
	isFunction: isFunction_2
};

var isArray_1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

var isArray = {
	isArray: isArray_1
};

function isObject(x) {
    return x != null && typeof x === 'object';
}
var isObject_2 = isObject;
//# sourceMappingURL=isObject.js.map

var isObject_1 = {
	isObject: isObject_2
};

var errorObject_1 = { e: {} };
//# sourceMappingURL=errorObject.js.map

var errorObject = {
	errorObject: errorObject_1
};

var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject.errorObject.e = e;
        return errorObject.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
var tryCatch_2 = tryCatch;

//# sourceMappingURL=tryCatch.js.map

var tryCatch_1 = {
	tryCatch: tryCatch_2
};

var __extends = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
var UnsubscriptionError_2 = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map

var UnsubscriptionError_1 = {
	UnsubscriptionError: UnsubscriptionError_2
};

var Subscription$1 = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject.errorObject.e.errors) : [errorObject.errorObject.e]);
            }
        }
        if (isArray.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
var Subscription_2 = Subscription$1;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

var Subscription_1 = {
	Subscription: Subscription_2
};

var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

var Observer = {
	empty: empty
};

var rxSubscriber = createCommonjsModule(function (module, exports) {
var Symbol = root$4.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map
});

var rxSubscriber_1 = rxSubscriber.rxSubscriber;
var rxSubscriber_2 = rxSubscriber.$$rxSubscriber;

var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = (function (_super) {
    __extends$1(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
var Subscriber_2 = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = (function (_super) {
    __extends$1(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
//# sourceMappingURL=Subscriber.js.map

var Subscriber_1 = {
	Subscriber: Subscriber_2
};

function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber.rxSubscriber]) {
            return nextOrObserver[rxSubscriber.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
var toSubscriber_2 = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

var toSubscriber_1 = {
	toSubscriber: toSubscriber_2
};

var observable = createCommonjsModule(function (module, exports) {
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root$4.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map
});

var observable_1 = observable.getSymbolObservable;
var observable_2 = observable.observable;
var observable_3 = observable.$$observable;

function noop$1() { }
var noop_2 = noop$1;
//# sourceMappingURL=noop.js.map

var noop_1 = {
	noop: noop_2
};

function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i - 0] = arguments[_i];
    }
    return pipeFromArray(fns);
}
var pipe_2 = pipe;
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
var pipeFromArray_1 = pipeFromArray;
//# sourceMappingURL=pipe.js.map

var pipe_1 = {
	pipe: pipe_2,
	pipeFromArray: pipeFromArray_1
};

var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable$$1 = new Observable();
        observable$$1.source = this;
        observable$$1.operator = operator;
        return observable$$1;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source || !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root$4.root.Rx && root$4.root.Rx.config && root$4.root.Rx.config.Promise) {
                PromiseCtor = root$4.root.Rx.config.Promise;
            }
            else if (root$4.root.Promise) {
                PromiseCtor = root$4.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root$4.root.Rx && root$4.root.Rx.config && root$4.root.Rx.config.Promise) {
                PromiseCtor = root$4.root.Rx.config.Promise;
            }
            else if (root$4.root.Promise) {
                PromiseCtor = root$4.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
var Observable_2 = Observable;
//# sourceMappingURL=Observable.js.map

var Observable_1 = {
	Observable: Observable_2
};

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
	HIDE_SEARCH: false
})(false);

var findVisible = reducerCreator({
	SHOW_SEARCH: true,
	HIDE_SEARCH: false,
	SHOW: false,
	HIDE: false
})(false);

var find = reducerCreator({
	SHOW_SEARCH: returnPayload('find'),
	SET_SEARCH: returnPayload('find')
})('');

var replace = reducerCreator({
	SHOW_SEARCH: '',
	SET_REPLACE: returnPayload('replace')
})('');

var options$1 = reducerCreator({
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
		return _extends$2({}, state, { value: pattern });
	},
	SHOW: function SHOW(state) {
		return _extends$2({}, state, { value: '' });
	}
	// SHOW: (state, { id }) => {
	// 	if (state.id === id) {
	// 		return state
	// 	}
	//
	// 	return {
	// 		value: '',
	// 		id
	// 	}
	// }
})({ value: '', id: '' });

var index$2 = reducerCreator({
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

var reducers = combineReducers({
	visible: visible,
	options: options$1,
	data: data,
	sparklingData: sparklingData,
	index: index$2,
	offset: offset,
	pattern: pattern,
	findVisible: findVisible,
	find: find,
	replace: replace
});

var fromSelectorFactory = function fromSelectorFactory(store) {
	return function (selector) {
		return Observable_2.create(function (observer) {
			store.subscribe(function () {
				var state = store.getState();
				var selectedState = selector(state);
				observer.next(selectedState);
			});
		}).distinctUntilChanged();
	};
};

var fromActionFactory = function fromActionFactory(store) {
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
	};

	store.dispatch = newDispatch;

	return function (actionType) {
		return Observable_2.create(function (observer) {
			subscribe({ actionType: actionType, observer: observer });
		});
	};
};

function storeFactory(reducers$$1) {
	var store = createStore(reducers$$1);
	var fromAction = fromActionFactory(store);
	var fromSelector = fromSelectorFactory(store);
	store.fromSelector = fromSelector;
	store.fromAction = fromAction;
	// store.subscribe(() => {
	// 	console.log(store.getState())
	// })

	return store;
}

var store = storeFactory(reducers);

var scorer = createCommonjsModule(function (module, exports) {
(function() {
  var AcronymResult, computeScore, emptyAcronymResult, isAcronymFullWord, isMatch, isSeparator, isWordEnd, isWordStart, miss_coeff, pos_bonus, scoreAcronyms, scoreCharacter, scoreConsecutives, scoreExact, scoreExactMatch, scorePattern, scorePosition, scoreSize, tau_size, wm;

  wm = 150;

  pos_bonus = 20;

  tau_size = 150;

  miss_coeff = 0.75;

  exports.score = function(string, query, options) {
    var allowErrors, preparedQuery, score, string_lw;
    preparedQuery = options.preparedQuery, allowErrors = options.allowErrors;
    if (!(allowErrors || isMatch(string, preparedQuery.core_lw, preparedQuery.core_up))) {
      return 0;
    }
    string_lw = string.toLowerCase();
    score = computeScore(string, string_lw, preparedQuery);
    return Math.ceil(score);
  };

  exports.isMatch = isMatch = function(subject, query_lw, query_up) {
    var i, j, m, n, qj_lw, qj_up, si;
    m = subject.length;
    n = query_lw.length;
    if (!m || n > m) {
      return false;
    }
    i = -1;
    j = -1;
    while (++j < n) {
      qj_lw = query_lw.charCodeAt(j);
      qj_up = query_up.charCodeAt(j);
      while (++i < m) {
        si = subject.charCodeAt(i);
        if (si === qj_lw || si === qj_up) {
          break;
        }
      }
      if (i === m) {
        return false;
      }
    }
    return true;
  };

  exports.computeScore = computeScore = function(subject, subject_lw, preparedQuery) {
    var acro, acro_score, align, csc_diag, csc_row, csc_score, csc_should_rebuild, i, j, m, miss_budget, miss_left, n, pos, query, query_lw, record_miss, score, score_diag, score_row, score_up, si_lw, start, sz;
    query = preparedQuery.query;
    query_lw = preparedQuery.query_lw;
    m = subject.length;
    n = query.length;
    acro = scoreAcronyms(subject, subject_lw, query, query_lw);
    acro_score = acro.score;
    if (acro.count === n) {
      return scoreExact(n, m, acro_score, acro.pos);
    }
    pos = subject_lw.indexOf(query_lw);
    if (pos > -1) {
      return scoreExactMatch(subject, subject_lw, query, query_lw, pos, n, m);
    }
    score_row = new Array(n);
    csc_row = new Array(n);
    sz = scoreSize(n, m);
    miss_budget = Math.ceil(miss_coeff * n) + 5;
    miss_left = miss_budget;
    csc_should_rebuild = true;
    j = -1;
    while (++j < n) {
      score_row[j] = 0;
      csc_row[j] = 0;
    }
    i = -1;
    while (++i < m) {
      si_lw = subject_lw[i];
      if (!si_lw.charCodeAt(0) in preparedQuery.charCodes) {
        if (csc_should_rebuild) {
          j = -1;
          while (++j < n) {
            csc_row[j] = 0;
          }
          csc_should_rebuild = false;
        }
        continue;
      }
      score = 0;
      score_diag = 0;
      csc_diag = 0;
      record_miss = true;
      csc_should_rebuild = true;
      j = -1;
      while (++j < n) {
        score_up = score_row[j];
        if (score_up > score) {
          score = score_up;
        }
        csc_score = 0;
        if (query_lw[j] === si_lw) {
          start = isWordStart(i, subject, subject_lw);
          csc_score = csc_diag > 0 ? csc_diag : scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);
          align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);
          if (align > score) {
            score = align;
            miss_left = miss_budget;
          } else {
            if (record_miss && --miss_left <= 0) {
              return Math.max(score, score_row[n - 1]) * sz;
            }
            record_miss = false;
          }
        }
        score_diag = score_up;
        csc_diag = csc_row[j];
        csc_row[j] = csc_score;
        score_row[j] = score;
      }
    }
    score = score_row[n - 1];
    return score * sz;
  };

  exports.isWordStart = isWordStart = function(pos, subject, subject_lw) {
    var curr_s, prev_s;
    if (pos === 0) {
      return true;
    }
    curr_s = subject[pos];
    prev_s = subject[pos - 1];
    return isSeparator(prev_s) || (curr_s !== subject_lw[pos] && prev_s === subject_lw[pos - 1]);
  };

  exports.isWordEnd = isWordEnd = function(pos, subject, subject_lw, len) {
    var curr_s, next_s;
    if (pos === len - 1) {
      return true;
    }
    curr_s = subject[pos];
    next_s = subject[pos + 1];
    return isSeparator(next_s) || (curr_s === subject_lw[pos] && next_s !== subject_lw[pos + 1]);
  };

  isSeparator = function(c) {
    return c === ' ' || c === '.' || c === '-' || c === '_' || c === '/' || c === '\\';
  };

  scorePosition = function(pos) {
    var sc;
    if (pos < pos_bonus) {
      sc = pos_bonus - pos;
      return 100 + sc * sc;
    } else {
      return Math.max(100 + pos_bonus - pos, 0);
    }
  };

  exports.scoreSize = scoreSize = function(n, m) {
    return tau_size / (tau_size + Math.abs(m - n));
  };

  scoreExact = function(n, m, quality, pos) {
    return 2 * n * (wm * quality + scorePosition(pos)) * scoreSize(n, m);
  };

  exports.scorePattern = scorePattern = function(count, len, sameCase, start, end) {
    var bonus, sz;
    sz = count;
    bonus = 6;
    if (sameCase === count) {
      bonus += 2;
    }
    if (start) {
      bonus += 3;
    }
    if (end) {
      bonus += 1;
    }
    if (count === len) {
      if (start) {
        if (sameCase === len) {
          sz += 2;
        } else {
          sz += 1;
        }
      }
      if (end) {
        bonus += 1;
      }
    }
    return sameCase + sz * (sz + bonus);
  };

  exports.scoreCharacter = scoreCharacter = function(i, j, start, acro_score, csc_score) {
    var posBonus;
    posBonus = scorePosition(i);
    if (start) {
      return posBonus + wm * ((acro_score > csc_score ? acro_score : csc_score) + 10);
    }
    return posBonus + wm * csc_score;
  };

  exports.scoreConsecutives = scoreConsecutives = function(subject, subject_lw, query, query_lw, i, j, startOfWord) {
    var k, m, mi, n, nj, sameCase, sz;
    m = subject.length;
    n = query.length;
    mi = m - i;
    nj = n - j;
    k = mi < nj ? mi : nj;
    sameCase = 0;
    sz = 0;
    if (query[j] === subject[i]) {
      sameCase++;
    }
    while (++sz < k && query_lw[++j] === subject_lw[++i]) {
      if (query[j] === subject[i]) {
        sameCase++;
      }
    }
    if (sz < k) {
      i--;
    }
    if (sz === 1) {
      return 1 + 2 * sameCase;
    }
    return scorePattern(sz, n, sameCase, startOfWord, isWordEnd(i, subject, subject_lw, m));
  };

  exports.scoreExactMatch = scoreExactMatch = function(subject, subject_lw, query, query_lw, pos, n, m) {
    var end, i, pos2, sameCase, start;
    start = isWordStart(pos, subject, subject_lw);
    if (!start) {
      pos2 = subject_lw.indexOf(query_lw, pos + 1);
      if (pos2 > -1) {
        start = isWordStart(pos2, subject, subject_lw);
        if (start) {
          pos = pos2;
        }
      }
    }
    i = -1;
    sameCase = 0;
    while (++i < n) {
      if (query[pos + i] === subject[i]) {
        sameCase++;
      }
    }
    end = isWordEnd(pos + n - 1, subject, subject_lw, m);
    return scoreExact(n, m, scorePattern(n, n, sameCase, start, end), pos);
  };

  AcronymResult = (function() {
    function AcronymResult(score, pos, count) {
      this.score = score;
      this.pos = pos;
      this.count = count;
    }

    return AcronymResult;

  })();

  emptyAcronymResult = new AcronymResult(0, 0.1, 0);

  exports.scoreAcronyms = scoreAcronyms = function(subject, subject_lw, query, query_lw) {
    var count, fullWord, i, j, m, n, qj_lw, sameCase, score, sepCount, sumPos;
    m = subject.length;
    n = query.length;
    if (!(m > 1 && n > 1)) {
      return emptyAcronymResult;
    }
    count = 0;
    sepCount = 0;
    sumPos = 0;
    sameCase = 0;
    i = -1;
    j = -1;
    while (++j < n) {
      qj_lw = query_lw[j];
      if (isSeparator(qj_lw)) {
        i = subject_lw.indexOf(qj_lw, i + 1);
        if (i > -1) {
          sepCount++;
          continue;
        } else {
          break;
        }
      }
      while (++i < m) {
        if (qj_lw === subject_lw[i] && isWordStart(i, subject, subject_lw)) {
          if (query[j] === subject[i]) {
            sameCase++;
          }
          sumPos += i;
          count++;
          break;
        }
      }
      if (i === m) {
        break;
      }
    }
    if (count < 2) {
      return emptyAcronymResult;
    }
    fullWord = count === n ? isAcronymFullWord(subject, subject_lw, query, count) : false;
    score = scorePattern(count, n, sameCase, true, fullWord);
    return new AcronymResult(score, sumPos / count, count + sepCount);
  };

  isAcronymFullWord = function(subject, subject_lw, query, nbAcronymInQuery) {
    var count, i, m, n;
    m = subject.length;
    n = query.length;
    count = 0;
    if (m > 12 * n) {
      return false;
    }
    i = -1;
    while (++i < m) {
      if (isWordStart(i, subject, subject_lw) && ++count > nbAcronymInQuery) {
        return false;
      }
    }
    return true;
  };

}).call(commonjsGlobal);
});

var scorer_1 = scorer.score;
var scorer_2 = scorer.isMatch;
var scorer_3 = scorer.computeScore;
var scorer_4 = scorer.isWordStart;
var scorer_5 = scorer.isWordEnd;
var scorer_6 = scorer.scoreSize;
var scorer_7 = scorer.scorePattern;
var scorer_8 = scorer.scoreCharacter;
var scorer_9 = scorer.scoreConsecutives;
var scorer_10 = scorer.scoreExactMatch;
var scorer_11 = scorer.scoreAcronyms;

var pathScorer = createCommonjsModule(function (module, exports) {
(function() {
  var computeScore, countDir, file_coeff, getExtension, getExtensionScore, isMatch, scorePath, scoreSize, tau_depth, _ref;

  _ref = scorer, isMatch = _ref.isMatch, computeScore = _ref.computeScore, scoreSize = _ref.scoreSize;

  tau_depth = 20;

  file_coeff = 2.5;

  exports.score = function(string, query, options) {
    var allowErrors, preparedQuery, score, string_lw;
    preparedQuery = options.preparedQuery, allowErrors = options.allowErrors;
    if (!(allowErrors || isMatch(string, preparedQuery.core_lw, preparedQuery.core_up))) {
      return 0;
    }
    string_lw = string.toLowerCase();
    score = computeScore(string, string_lw, preparedQuery);
    score = scorePath(string, string_lw, score, options);
    return Math.ceil(score);
  };

  scorePath = function(subject, subject_lw, fullPathScore, options) {
    var alpha, basePathScore, basePos, depth, end, extAdjust, fileLength, pathSeparator, preparedQuery, useExtensionBonus;
    if (fullPathScore === 0) {
      return 0;
    }
    preparedQuery = options.preparedQuery, useExtensionBonus = options.useExtensionBonus, pathSeparator = options.pathSeparator;
    end = subject.length - 1;
    while (subject[end] === pathSeparator) {
      end--;
    }
    basePos = subject.lastIndexOf(pathSeparator, end);
    fileLength = end - basePos;
    extAdjust = 1.0;
    if (useExtensionBonus) {
      extAdjust += getExtensionScore(subject_lw, preparedQuery.ext, basePos, end, 2);
      fullPathScore *= extAdjust;
    }
    if (basePos === -1) {
      return fullPathScore;
    }
    depth = preparedQuery.depth;
    while (basePos > -1 && depth-- > 0) {
      basePos = subject.lastIndexOf(pathSeparator, basePos - 1);
    }
    basePathScore = basePos === -1 ? fullPathScore : extAdjust * computeScore(subject.slice(basePos + 1, end + 1), subject_lw.slice(basePos + 1, end + 1), preparedQuery);
    alpha = 0.5 * tau_depth / (tau_depth + countDir(subject, end + 1, pathSeparator));
    return alpha * basePathScore + (1 - alpha) * fullPathScore * scoreSize(0, file_coeff * fileLength);
  };

  exports.countDir = countDir = function(path$$1, end, pathSeparator) {
    var count, i;
    if (end < 1) {
      return 0;
    }
    count = 0;
    i = -1;
    while (++i < end && path$$1[i] === pathSeparator) {
      continue;
    }
    while (++i < end) {
      if (path$$1[i] === pathSeparator) {
        count++;
        while (++i < end && path$$1[i] === pathSeparator) {
          continue;
        }
      }
    }
    return count;
  };

  exports.getExtension = getExtension = function(str) {
    var pos;
    pos = str.lastIndexOf(".");
    if (pos < 0) {
      return "";
    } else {
      return str.substr(pos + 1);
    }
  };

  getExtensionScore = function(candidate, ext, startPos, endPos, maxDepth) {
    var m, matched, n, pos;
    if (!ext.length) {
      return 0;
    }
    pos = candidate.lastIndexOf(".", endPos);
    if (!(pos > startPos)) {
      return 0;
    }
    n = ext.length;
    m = endPos - pos;
    if (m < n) {
      n = m;
      m = ext.length;
    }
    pos++;
    matched = -1;
    while (++matched < n) {
      if (candidate[pos + matched] !== ext[matched]) {
        break;
      }
    }
    if (matched === 0 && maxDepth > 0) {
      return 0.9 * getExtensionScore(candidate, ext, startPos, pos - 2, maxDepth - 1);
    }
    return matched / m;
  };

}).call(commonjsGlobal);
});

var pathScorer_1 = pathScorer.score;
var pathScorer_2 = pathScorer.countDir;
var pathScorer_3 = pathScorer.getExtension;

var query = createCommonjsModule(function (module) {
(function() {
  var Query, coreChars, countDir, getCharCodes, getExtension, opt_char_re, truncatedUpperCase, _ref;

  _ref = pathScorer, countDir = _ref.countDir, getExtension = _ref.getExtension;

  module.exports = Query = (function() {
    function Query(query, _arg) {
      var optCharRegEx, pathSeparator, _ref1;
      _ref1 = _arg != null ? _arg : {}, optCharRegEx = _ref1.optCharRegEx, pathSeparator = _ref1.pathSeparator;
      if (!(query && query.length)) {
        return null;
      }
      this.query = query;
      this.query_lw = query.toLowerCase();
      this.core = coreChars(query, optCharRegEx);
      this.core_lw = this.core.toLowerCase();
      this.core_up = truncatedUpperCase(this.core);
      this.depth = countDir(query, query.length, pathSeparator);
      this.ext = getExtension(this.query_lw);
      this.charCodes = getCharCodes(this.query_lw);
    }

    return Query;

  })();

  opt_char_re = /[ _\-:\/\\]/g;

  coreChars = function(query, optCharRegEx) {
    if (optCharRegEx == null) {
      optCharRegEx = opt_char_re;
    }
    return query.replace(optCharRegEx, '');
  };

  truncatedUpperCase = function(str) {
    var char, upper, _i, _len;
    upper = "";
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      char = str[_i];
      upper += char.toUpperCase()[0];
    }
    return upper;
  };

  getCharCodes = function(str) {
    var charCodes, i, len;
    len = str.length;
    i = -1;
    charCodes = [];
    while (++i < len) {
      charCodes[str.charCodeAt(i)] = true;
    }
    return charCodes;
  };

}).call(commonjsGlobal);
});

var filter = createCommonjsModule(function (module) {
(function() {
  var Query, pathScorer$$1, pluckCandidates, scorer$$1, sortCandidates;

  scorer$$1 = scorer;

  pathScorer$$1 = pathScorer;

  pluckCandidates = function(a) {
    return a.candidate;
  };

  sortCandidates = function(a, b) {
    return b.score - a.score;
  };

  module.exports = function(candidates, query$$1, options) {
    var bKey, candidate, key, maxInners, maxResults, score, scoreProvider, scoredCandidates, spotLeft, string, usePathScoring, _i, _len;
    scoredCandidates = [];
    key = options.key, maxResults = options.maxResults, maxInners = options.maxInners, usePathScoring = options.usePathScoring;
    spotLeft = (maxInners != null) && maxInners > 0 ? maxInners : candidates.length + 1;
    bKey = key != null;
    scoreProvider = usePathScoring ? pathScorer$$1 : scorer$$1;
    for (_i = 0, _len = candidates.length; _i < _len; _i++) {
      candidate = candidates[_i];
      string = bKey ? candidate[key] : candidate;
      if (!string) {
        continue;
      }
      score = scoreProvider.score(string, query$$1, options);
      if (score > 0) {
        scoredCandidates.push({
          candidate: candidate,
          score: score
        });
        if (!--spotLeft) {
          break;
        }
      }
    }
    scoredCandidates.sort(sortCandidates);
    candidates = scoredCandidates.map(pluckCandidates);
    if (maxResults != null) {
      candidates = candidates.slice(0, maxResults);
    }
    return candidates;
  };

}).call(commonjsGlobal);
});

var matcher = createCommonjsModule(function (module, exports) {
(function() {
  var basenameMatch, computeMatch, isMatch, isWordStart, match, mergeMatches, scoreAcronyms, scoreCharacter, scoreConsecutives, _ref;

  _ref = scorer, isMatch = _ref.isMatch, isWordStart = _ref.isWordStart, scoreConsecutives = _ref.scoreConsecutives, scoreCharacter = _ref.scoreCharacter, scoreAcronyms = _ref.scoreAcronyms;

  exports.match = match = function(string, query, options) {
    var allowErrors, baseMatches, matches, pathSeparator, preparedQuery, string_lw;
    allowErrors = options.allowErrors, preparedQuery = options.preparedQuery, pathSeparator = options.pathSeparator;
    if (!(allowErrors || isMatch(string, preparedQuery.core_lw, preparedQuery.core_up))) {
      return [];
    }
    string_lw = string.toLowerCase();
    matches = computeMatch(string, string_lw, preparedQuery);
    if (matches.length === 0) {
      return matches;
    }
    if (string.indexOf(pathSeparator) > -1) {
      baseMatches = basenameMatch(string, string_lw, preparedQuery, pathSeparator);
      matches = mergeMatches(matches, baseMatches);
    }
    return matches;
  };

  exports.wrap = function(string, query, options) {
    var matchIndex, matchPos, matchPositions, output, strPos, tagClass, tagClose, tagOpen, _ref1;
    if ((options.wrap != null)) {
      _ref1 = options.wrap, tagClass = _ref1.tagClass, tagOpen = _ref1.tagOpen, tagClose = _ref1.tagClose;
    }
    if (tagClass == null) {
      tagClass = 'highlight';
    }
    if (tagOpen == null) {
      tagOpen = '<strong class="' + tagClass + '">';
    }
    if (tagClose == null) {
      tagClose = '</strong>';
    }
    if (string === query) {
      return tagOpen + string + tagClose;
    }
    matchPositions = match(string, query, options);
    if (matchPositions.length === 0) {
      return string;
    }
    output = '';
    matchIndex = -1;
    strPos = 0;
    while (++matchIndex < matchPositions.length) {
      matchPos = matchPositions[matchIndex];
      if (matchPos > strPos) {
        output += string.substring(strPos, matchPos);
        strPos = matchPos;
      }
      while (++matchIndex < matchPositions.length) {
        if (matchPositions[matchIndex] === matchPos + 1) {
          matchPos++;
        } else {
          matchIndex--;
          break;
        }
      }
      matchPos++;
      if (matchPos > strPos) {
        output += tagOpen;
        output += string.substring(strPos, matchPos);
        output += tagClose;
        strPos = matchPos;
      }
    }
    if (strPos <= string.length - 1) {
      output += string.substring(strPos);
    }
    return output;
  };

  basenameMatch = function(subject, subject_lw, preparedQuery, pathSeparator) {
    var basePos, depth, end;
    end = subject.length - 1;
    while (subject[end] === pathSeparator) {
      end--;
    }
    basePos = subject.lastIndexOf(pathSeparator, end);
    if (basePos === -1) {
      return [];
    }
    depth = preparedQuery.depth;
    while (depth-- > 0) {
      basePos = subject.lastIndexOf(pathSeparator, basePos - 1);
      if (basePos === -1) {
        return [];
      }
    }
    basePos++;
    end++;
    return computeMatch(subject.slice(basePos, end), subject_lw.slice(basePos, end), preparedQuery, basePos);
  };

  mergeMatches = function(a, b) {
    var ai, bj, i, j, m, n, out;
    m = a.length;
    n = b.length;
    if (n === 0) {
      return a.slice();
    }
    if (m === 0) {
      return b.slice();
    }
    i = -1;
    j = 0;
    bj = b[j];
    out = [];
    while (++i < m) {
      ai = a[i];
      while (bj <= ai && ++j < n) {
        if (bj < ai) {
          out.push(bj);
        }
        bj = b[j];
      }
      out.push(ai);
    }
    while (j < n) {
      out.push(b[j++]);
    }
    return out;
  };

  computeMatch = function(subject, subject_lw, preparedQuery, offset) {
    var DIAGONAL, LEFT, STOP, UP, acro_score, align, backtrack, csc_diag, csc_row, csc_score, i, j, m, matches, move, n, pos, query, query_lw, score, score_diag, score_row, score_up, si_lw, start, trace;
    if (offset == null) {
      offset = 0;
    }
    query = preparedQuery.query;
    query_lw = preparedQuery.query_lw;
    m = subject.length;
    n = query.length;
    acro_score = scoreAcronyms(subject, subject_lw, query, query_lw).score;
    score_row = new Array(n);
    csc_row = new Array(n);
    STOP = 0;
    UP = 1;
    LEFT = 2;
    DIAGONAL = 3;
    trace = new Array(m * n);
    pos = -1;
    j = -1;
    while (++j < n) {
      score_row[j] = 0;
      csc_row[j] = 0;
    }
    i = -1;
    while (++i < m) {
      score = 0;
      score_up = 0;
      csc_diag = 0;
      si_lw = subject_lw[i];
      j = -1;
      while (++j < n) {
        csc_score = 0;
        align = 0;
        score_diag = score_up;
        if (query_lw[j] === si_lw) {
          start = isWordStart(i, subject, subject_lw);
          csc_score = csc_diag > 0 ? csc_diag : scoreConsecutives(subject, subject_lw, query, query_lw, i, j, start);
          align = score_diag + scoreCharacter(i, j, start, acro_score, csc_score);
        }
        score_up = score_row[j];
        csc_diag = csc_row[j];
        if (score > score_up) {
          move = LEFT;
        } else {
          score = score_up;
          move = UP;
        }
        if (align > score) {
          score = align;
          move = DIAGONAL;
        } else {
          csc_score = 0;
        }
        score_row[j] = score;
        csc_row[j] = csc_score;
        trace[++pos] = score > 0 ? move : STOP;
      }
    }
    i = m - 1;
    j = n - 1;
    pos = i * n + j;
    backtrack = true;
    matches = [];
    while (backtrack && i >= 0 && j >= 0) {
      switch (trace[pos]) {
        case UP:
          i--;
          pos -= n;
          break;
        case LEFT:
          j--;
          pos--;
          break;
        case DIAGONAL:
          matches.push(i + offset);
          j--;
          i--;
          pos -= n + 1;
          break;
        default:
          backtrack = false;
      }
    }
    matches.reverse();
    return matches;
  };

}).call(commonjsGlobal);
});

var matcher_1 = matcher.match;
var matcher_2 = matcher.wrap;

var fuzzaldrin = createCommonjsModule(function (module) {
(function() {
  var Query, defaultPathSeparator, filter$$1, matcher$$1, parseOptions, pathScorer$$1, preparedQueryCache, scorer$$1;

  filter$$1 = filter;

  matcher$$1 = matcher;

  scorer$$1 = scorer;

  pathScorer$$1 = pathScorer;

  Query = query;

  preparedQueryCache = null;

  defaultPathSeparator = (typeof process !== "undefined" && process !== null ? process.platform : void 0) === "win32" ? '\\' : '/';

  module.exports = {
    filter: function(candidates, query$$1, options) {
      if (options == null) {
        options = {};
      }
      if (!((query$$1 != null ? query$$1.length : void 0) && (candidates != null ? candidates.length : void 0))) {
        return [];
      }
      options = parseOptions(options, query$$1);
      return filter$$1(candidates, query$$1, options);
    },
    score: function(string, query$$1, options) {
      if (options == null) {
        options = {};
      }
      if (!((string != null ? string.length : void 0) && (query$$1 != null ? query$$1.length : void 0))) {
        return 0;
      }
      options = parseOptions(options, query$$1);
      if (options.usePathScoring) {
        return pathScorer$$1.score(string, query$$1, options);
      } else {
        return scorer$$1.score(string, query$$1, options);
      }
    },
    match: function(string, query$$1, options) {
      var _i, _ref, _results;
      if (options == null) {
        options = {};
      }
      if (!string) {
        return [];
      }
      if (!query$$1) {
        return [];
      }
      if (string === query$$1) {
        return (function() {
          _results = [];
          for (var _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
      }
      options = parseOptions(options, query$$1);
      return matcher$$1.match(string, query$$1, options);
    },
    wrap: function(string, query$$1, options) {
      if (options == null) {
        options = {};
      }
      if (!string) {
        return [];
      }
      if (!query$$1) {
        return [];
      }
      options = parseOptions(options, query$$1);
      return matcher$$1.wrap(string, query$$1, options);
    },
    prepareQuery: function(query$$1, options) {
      if (options == null) {
        options = {};
      }
      options = parseOptions(options, query$$1);
      return options.preparedQuery;
    }
  };

  parseOptions = function(options, query$$1) {
    if (options.allowErrors == null) {
      options.allowErrors = false;
    }
    if (options.usePathScoring == null) {
      options.usePathScoring = true;
    }
    if (options.useExtensionBonus == null) {
      options.useExtensionBonus = false;
    }
    if (options.pathSeparator == null) {
      options.pathSeparator = defaultPathSeparator;
    }
    if (options.optCharRegEx == null) {
      options.optCharRegEx = null;
    }
    if (options.wrap == null) {
      options.wrap = null;
    }
    if (options.preparedQuery == null) {
      options.preparedQuery = preparedQueryCache && preparedQueryCache.query === query$$1 ? preparedQueryCache : (preparedQueryCache = new Query(query$$1, options));
    }
    return options;
  };

}).call(commonjsGlobal);
});

var fuzzaldrin_1 = fuzzaldrin.filter;
var fuzzaldrin_2 = fuzzaldrin.score;
var fuzzaldrin_3 = fuzzaldrin.match;
var fuzzaldrin_4 = fuzzaldrin.wrap;
var fuzzaldrin_5 = fuzzaldrin.prepareQuery;

var defaultRenderer = function defaultRenderer(_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    className = _ref.className,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var value = item.value;


	var finalClassName = classnames(className, index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	var wrappedValue = pattern && pattern.length ? fuzzaldrin.wrap(value, pattern) : value;

	return h('div', {
		className: finalClassName,
		'aria-role': 'button',
		onClick: function onClick() {
			return accept(item);
		},
		dangerouslySetInnerHTML: { __html: wrappedValue }
	});
};

var commandFactory = (function (optionsFactory) {
	var _optionsFactory = optionsFactory(h, store),
	    loadData = _optionsFactory.loadData,
	    accept = _optionsFactory.accept,
	    _optionsFactory$rende = _optionsFactory.renderer,
	    renderer = _optionsFactory$rende === undefined ? defaultRenderer : _optionsFactory$rende,
	    _optionsFactory$previ = _optionsFactory.preview,
	    preview = _optionsFactory$previ === undefined ? null : _optionsFactory$previ,
	    extraOptions = objectWithoutProperties$1(_optionsFactory, ['loadData', 'accept', 'renderer', 'preview']);

	var options$$1 = _extends$2({
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		preview: preview
	}, extraOptions);

	return function (extras) {
		options$$1 = extras ? _extends$2({}, options$$1, extras) : options$$1;

		var state = store.getState();

		if (isVisible(state)) {
			var storeOptions = getOptions(state);
			var sparklingInput = document.getElementById('sparkling-input');

			if (storeOptions === options$$1) {
				if (sparklingInput === document.activeElement) {
					store.dispatch({
						type: 'HIDE'
					});
				} else {
					sparklingInput.focus();
				}
			} else {
				store.dispatch({
					type: 'SHOW',
					payload: options$$1
				});
				sparklingInput.focus();
			}
		} else {
			store.dispatch({
				type: 'SHOW',
				payload: options$$1
			});
		}
	};
});

var loadData = (function (onData) {
	var cwd = atom.project.getPaths()[0];
	var cmdProcess = child_process.spawn('git', ['branch'], { cwd: cwd });
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').filter(function (s) {
			return s.length > 1;
		}).map(function (value) {
			return { value: value };
		}));
	});
});

var gitBranchesFactory = function gitBranchesFactory(h, store) {
	var accept = function accept(branch) {
		var cwd = atom.project.getPaths()[0];
		var value = branch.value.trim(0);

		if (/^\*/.test(value)) {
			return;
		}

		var cmdProcess = child_process.spawn('git', ['checkout', value], { cwd: cwd });
		cmdProcess.stdout.on('data', function () {
			store.dispatch({
				type: 'HIDE'
			});
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		description: 'Checkout git branches',
		id: 'sparkling-git-branches'
	};
};

var gitBranches = commandFactory(gitBranchesFactory);

var loadData$1 = (function (onData) {
	var cwd = atom.project.getPaths()[0];
	var cmdProcess = child_process.spawn('rg', ['--files'], { cwd: cwd });
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

var fileIconsService = null;

var setFileIconsService = function setFileIconsService(service) {
	fileIconsService = service;
};

var iconClassForPath = function iconClassForPath(path$$1) {
	return fileIconsService.iconClassForPath(path$$1);
};

var renderer = (function (props) {
	return defaultRenderer(_extends$2({}, props, {
		className: ['icon'].concat(toConsumableArray(iconClassForPath(props.item.value)))
	}));
});

var filesFactory = function filesFactory(h, store) {
	var accept = function accept(file) {
		atom.workspace.open(file.value);
		store.dispatch({
			type: 'HIDE'
		});
	};

	return {
		loadData: loadData$1,
		accept: accept,
		renderer: renderer,
		description: 'Find files in project',
		id: 'sparkling-files'
	};
};

var files = commandFactory(filesFactory);

var loadDataFactory = (function (_ref) {
	var hideDeletedFiles = _ref.hideDeletedFiles;
	return function (onData) {
		var cwd = atom.project.getPaths()[0];
		var cmdProcess = child_process.spawn('git', ['status', '-s'], { cwd: cwd });

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

var renderer$1 = (function (_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    className = _ref.className,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var value = item.value,
	    status = item.status;


	var finalClassName = classnames(className, ['icon'].concat(toConsumableArray(iconClassForPath(value))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	var wrappedValue = pattern && pattern.length ? fuzzaldrin.wrap(value, pattern) : value;

	var statusLabel = void 0;

	if (status === 'M ') {
		statusLabel = h(
			'span',
			{ className: 'git-status-modified-staged' },
			'modified'
		);
	} else if (status === ' M') {
		statusLabel = h(
			'span',
			{ className: 'git-status-modified' },
			'modified'
		);
	} else if (status === 'MM') {
		statusLabel = [h(
			'span',
			{ className: 'git-status-modified-staged' },
			'modi'
		), h(
			'span',
			{ className: 'git-status-modified' },
			'fied'
		)];
	} else if (status === '??') {
		statusLabel = h(
			'span',
			{ className: 'git-status-untracked' },
			'untracked'
		);
	} else if (status === 'D ') {
		statusLabel = h(
			'span',
			{ className: 'git-status-deleted-staged' },
			'deleted'
		);
	} else if (status === ' D') {
		statusLabel = h(
			'span',
			{ className: 'git-status-deleted' },
			'deleted'
		);
	} else if (status === 'AD') {
		statusLabel = h(
			'span',
			{ className: 'git-status-deleted' },
			'deleted'
		);
	} else if (status === 'DD') {
		statusLabel = [h(
			'span',
			{ className: 'git-status-deleted-staged' },
			'del'
		), h(
			'span',
			{ className: 'git-status-deleted' },
			'eted'
		)];
	} else if (status === 'A ') {
		statusLabel = h(
			'span',
			{ className: 'git-status-new-file-staged' },
			'new file'
		);
	} else if (status === ' A') {
		statusLabel = h(
			'span',
			{ className: 'git-status-new-file-staged' },
			'new file'
		);
	} else if (status === 'AM') {
		statusLabel = h(
			'span',
			{ className: 'git-status-new-file-staged' },
			'new file'
		);
	} else {
		statusLabel = status;
	}

	return h(
		'div',
		{
			className: finalClassName,
			'aria-role': 'button',
			onClick: function onClick() {
				return accept(item);
			}
		},
		h(
			'span',
			{ className: 'git-status' },
			statusLabel
		),
		h('span', { dangerouslySetInnerHTML: { __html: wrappedValue } })
	);
});

var gitFilesFactory = function gitFilesFactory(h, store) {
	var loadData = loadDataFactory({ hideDeletedFiles: true });

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
		renderer: renderer$1,
		description: 'Find git status files',
		id: 'sparkling-git-files'
	};
};

var gitFiles = commandFactory(gitFilesFactory);

var gitStageFactory = function gitStageFactory(h, store) {
	var loadData = loadDataFactory({ hideDeletedFiles: false });

	var accept = function accept(_ref) {
		var path$$1 = _ref.path,
		    status = _ref.status;

		var cwd = atom.project.getPaths()[0];

		var cmdProcess = void 0;
		var unstaged = [' M', 'MM', '??', ' D', 'AD', 'DD', ' A'];

		if (unstaged.includes(status)) {
			cmdProcess = child_process.spawn('git', ['add', path$$1], {
				cwd: cwd
			});
		} else {
			cmdProcess = child_process.spawn('git', ['reset', path$$1], {
				cwd: cwd
			});
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
		renderer: renderer$1,
		description: 'Stage and unstage git files',
		id: 'sparkling-git-stage'
	};
};

var gitStage = commandFactory(gitStageFactory);

var linesFactory = function linesFactory(h, store) {
	var loadData = function loadData(onData) {
		var editor = atom.workspace.getActiveTextEditor();
		var buffer = editor.getBuffer();
		var lines = buffer.getLines().map(function (value, lineNumber) {
			return {
				value: value,
				lineNumber: lineNumber
			};
		}).filter(function (_ref) {
			var value = _ref.value;
			return value.trim().length > 1;
		}).reverse();
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
		id: 'sparkling-buffer-lines'
	};
};

var lines = commandFactory(linesFactory);

var RG_RESULT = 'RG_RESULT';

var loadDataFactory$1 = (function (store) {
	return function (onData) {
		var find = getFind(store.getState());
		var replace = getReplace(store.getState());

		var cwd = atom.project.getPaths()[0];
		var cmdProcess = child_process.spawn('rg', [find, '-n', '--replace', RG_RESULT, '--max-filesize', '100K'], {
			cwd: cwd
		});
		cmdProcess.stdout.on('data', function (data) {
			onData(data.toString('utf-8').split('\n').reduce(function (acc, value) {
				var _value$split = value.split(':', 3),
				    _value$split2 = slicedToArray(_value$split, 3),
				    path$$1 = _value$split2[0],
				    lineNumber = _value$split2[1],
				    line = _value$split2[2];

				if (line && line.length > 1) {
					line.split(RG_RESULT).forEach(function (_, index, splitLine) {
						if (index === splitLine.length - 1) {
							return;
						}

						var line = splitLine.reduce(function (s, substr, i) {
							if (i === index) {
								return s + substr + RG_RESULT;
							} else if (i < splitLine.length - 1) {
								return s + substr + find;
							}

							return s + substr;
						}, '');

						acc.push({
							value: value.split(':', 2).concat([line]).join(''),
							find: find,
							line: line,
							path: path$$1,
							lineNumber: lineNumber,
							replace: replace
						});
					});
				}
				return acc;
			}, []));
		});

		return function () {
			cmdProcess.stdin.pause();
			cmdProcess.kill();
		};
	};
});

var renderer$2 = (function (_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    index = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept;
	var find = item.find,
	    value = item.value,
	    path$$1 = item.path;


	var fuzzyMatches = pattern && pattern.length ? fuzzaldrin.match(value.replace(RG_RESULT, find), pattern) : [];

	var styleHash = fuzzyMatches.reduce(function (acc, x) {
		acc[x] = 'fuzzy';
		return acc;
	}, {});

	styleHash[value.indexOf(RG_RESULT)] = styleHash[value.indexOf(RG_RESULT)] ? 'findOpenAndFuzzy' : 'findOpen';
	styleHash[value.indexOf(RG_RESULT) + find.length - 1] = styleHash[value.indexOf(RG_RESULT) + find.length - 1] ? 'findCloseAndFuzzy' : 'findClose';

	var rawValue = value.replace(new RegExp(RG_RESULT, 'g'), find);
	var wrappedValue = '';

	for (var i = 0; i < rawValue.length; i++) {
		var c = rawValue[i];

		if (styleHash[i] === 'fuzzy') {
			wrappedValue += '<span class="highlight">' + c + '</span>';
		} else if (styleHash[i] === 'findOpenAndFuzzy') {
			wrappedValue += '<span class="find-highlight"><span class="highlight">' + c + '</span>';
		} else if (styleHash[i] === 'findOpen') {
			wrappedValue += '<span class="find-highlight">' + c;
		} else if (styleHash[i] === 'findClose') {
			wrappedValue += c + '</span>';
		} else if (styleHash[i] === 'findCloseAndFuzzy') {
			wrappedValue += '<span class="highlight">' + c + '</span></span>';
		} else {
			wrappedValue += c;
		}
	}

	var finalClassName = classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	return h('div', {
		className: finalClassName,
		'aria-role': 'button',
		onClick: function onClick() {
			return accept(item);
		},
		dangerouslySetInnerHTML: { __html: wrappedValue }
	});
});

var findFactory = function findFactory(h, store) {
	var loadData = loadDataFactory$1(store);

	var accept = function accept(line) {
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$2,
		description: 'Find pattern in project',
		id: 'sparkling-project-find'
	};
};

var find$1 = commandFactory(findFactory);

var replaceRenderer = function replaceRenderer(_ref) {
	var item = _ref.item,
	    pattern = _ref.pattern,
	    index$$1 = _ref.index,
	    selectedIndex = _ref.selectedIndex,
	    accept = _ref.accept,
	    replace = _ref.replace;
	var find = item.find,
	    value = item.value,
	    path$$1 = item.path;


	var rawValue = value.replace(RG_RESULT, find);

	var fuzzyMatches = pattern && pattern.length ? fuzzaldrin.match(rawValue, pattern) : [];

	var styleHash = fuzzyMatches.reduce(function (acc, x) {
		acc[x] = 'fuzzy';
		return acc;
	}, {});

	styleHash[value.indexOf(RG_RESULT)] = styleHash[value.indexOf(RG_RESULT)] ? 'findOpenAndFuzzy' : 'findOpen';
	styleHash[value.indexOf(RG_RESULT) + find.length - 1] = styleHash[value.indexOf(RG_RESULT) + find.length - 1] ? 'findCloseAndFuzzy' : 'findClose';

	var wrappedValue = '';

	for (var i = 0; i < rawValue.length; i++) {
		var c = rawValue[i];

		if (styleHash[i] === 'fuzzy') {
			wrappedValue += '<span class="highlight">' + c + '</span>';
		} else if (styleHash[i] === 'findOpenAndFuzzy') {
			wrappedValue += '<span class="replace-downlight"><span class="highlight">' + c + '</span>';
		} else if (styleHash[i] === 'findOpen') {
			wrappedValue += '<span class="replace-downlight">' + c;
		} else if (styleHash[i] === 'findClose') {
			wrappedValue += c + '</span><span class="replace-highlight">' + replace + '</span>';
		} else if (styleHash[i] === 'findCloseAndFuzzy') {
			wrappedValue += '<span class="highlight">' + c + '</span></span><span class="replace-highlight">' + replace + '</span>';
		} else {
			wrappedValue += c;
		}
	}

	var finalClassName = classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1))), index$$1 === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

	return h('div', {
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

var renderer$3 = (function (props) {
	return h(Replace, props);
});

var ReplaceInput = function ReplaceInput(_ref) {
	var value = _ref.value,
	    setValue = _ref.setValue;
	return h(Input, {
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

var replaceFactory = function replaceFactory(h$$1, store) {
	var loadData = loadDataFactory$1(store);

	var accept = function accept(item) {
		var replace = getReplace(store.getState());
		var lineNumber = item.lineNumber,
		    path$$1 = item.path,
		    find = item.find;

		var cwd = atom.project.getPaths()[0];

		var sedRegex = lineNumber + ',' + (lineNumber + 1) + 's/' + find + '/' + replace + '/';
		child_process.spawn('sed', ['-i', '', '-e', sedRegex, path$$1], {
			cwd: cwd
		});
		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: item
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$3,
		description: 'Replace pattern in project',
		id: 'sparkling-project-replace',
		childrenRenderer: function childrenRenderer() {
			return h$$1(ReplaceInputContainer, null);
		}
	};
};

var replace$1 = commandFactory(replaceFactory);

var loadData$2 = (function (onData) {
	var cwd = atom.project.getPaths()[0];
	var cmdProcess = child_process.spawn('rg', ['^.*$', '-n', '--max-filesize', '100K'], {
		cwd: cwd
	});
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').reduce(function (acc, value) {
			var _value$split = value.split(':', 3),
			    _value$split2 = slicedToArray(_value$split, 3),
			    path$$1 = _value$split2[0],
			    lineNumber = _value$split2[1],
			    line = _value$split2[2];

			if (line && line.length > 1) {
				acc.push({ value: value, path: path$$1, line: line, lineNumber: lineNumber });
			}
			return acc;
		}, []));
	});

	return function () {
		cmdProcess.stdout.pause();
		cmdProcess.kill();
	};
});

var allLinesFactory = function allLinesFactory(h, store) {
	var accept = function accept(line) {
		store.dispatch({ type: 'HIDE' });
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		});
	};

	return {
		loadData: loadData$2,
		accept: accept,
		description: 'Find lines in project',
		id: 'sparkling-project-lines'
	};
};

var allLines = commandFactory(allLinesFactory);

var renderer$4 = (function (_ref) {
	var item = _ref.item,
	    props = objectWithoutProperties$1(_ref, ['item']);
	return defaultRenderer(_extends$2({}, props, {
		item: _extends$2({}, item, {
			value: item.line
		})
	}));
});

var autocompleteLinesFactory = function autocompleteLinesFactory(h, store) {
	var accept = function accept(item) {
		store.dispatch({ type: 'HIDE' });
		var editor = atom.workspace.getActiveTextEditor();
		editor.insertText(item.line);
	};

	return {
		loadData: loadData$2,
		accept: accept,
		renderer: renderer$4,
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	};
};

var autocompleteLines = commandFactory(autocompleteLinesFactory);

var config = {
	files: {
		title: 'Find files with ripgrep',
		description: 'Enable find files with ripgrep (requires ripgrep installed in path)',
		type: 'boolean',
		default: false
	},
	gitFiles: {
		title: 'Find files with git',
		description: 'Enable find files that have been modified according to git',
		type: 'boolean',
		default: true
	},
	gitStage: {
		title: 'Stage files with git',
		description: 'Enable staging files with git',
		type: 'boolean',
		default: true
	},
	gitBranches: {
		title: 'Checkout git branches',
		description: 'Enable checkout git branches',
		type: 'boolean',
		default: true
	},
	lines: {
		title: 'Find buffer lines',
		description: 'Enable find buffer lines',
		type: 'boolean',
		default: true
	},
	allLines: {
		title: 'Find project lines',
		description: 'Enable find project lines',
		type: 'boolean',
		default: true
	},
	autocompleteLines: {
		title: 'Autocomplete project lines',
		description: 'Enable autocomplete project lines',
		type: 'boolean',
		default: true
	},
	find: {
		title: 'Find pattern with ripgrep',
		description: 'Enable autocomplete find with ripgrep',
		type: 'boolean',
		default: true
	},
	replace: {
		title: 'Find pattern with ripgrep',
		description: 'Enable autocomplete replace with ripgrep',
		type: 'boolean',
		default: true
	}
};

var loadDataFactory$2 = (function (store) {
	return function (onData) {
		var options = getOptions(store.getState());
		var path$$1 = options.path;


		var cwd = atom.project.getPaths()[0];
		var cmdProcess = child_process.spawn('ls', ['-a', path$$1], {
			cwd: cwd
		});

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

var renderer$5 = (function (props) {
	var absolutePath = props.item.absolutePath;


	return defaultRenderer(_extends$2({}, props, {
		className: ['icon'].concat(toConsumableArray(iconClassForPath(absolutePath)))
	}));
});

var lsFactory = function lsFactory(h, store) {
	var loadData = loadDataFactory$2(store);

	var accept = function accept(_ref) {
		var absolutePath = _ref.absolutePath;

		if (fs.lstatSync(absolutePath).isDirectory()) {
			ls({ path: absolutePath });
		} else {
			store.dispatch({ type: 'HIDE' });
			atom.workspace.open(absolutePath);
		}
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer$5,
		description: 'Project navigation',
		id: 'sparkling-ls'
	};
};

var ls = commandFactory(lsFactory);

var next = function next() {
	var state = store.getState();
	var index = getIndex(state);
	var sparklingData = getSparklingData(state);

	if (index === 9) {
		var offset = getOffset(state);
		var value = Math.min(offset + 1, sparklingData.length - 10);
		store.dispatch({ type: 'SET_OFFSET', payload: { value: value } });
	} else {
		var _value = Math.min(index + 1, sparklingData.length - 1, 9);
		store.dispatch({ type: 'SET_INDEX', payload: { value: _value } });
	}
};

var previous = function previous() {
	var state = store.getState();
	var index = getIndex(state);

	if (index === 0) {
		var offset = getOffset(state);
		var value = Math.max(offset - 1, 0);
		store.dispatch({ type: 'SET_OFFSET', payload: { value: value } });
	} else {
		var _value2 = Math.max(index - 1, 0);
		store.dispatch({ type: 'SET_INDEX', payload: { value: _value2 } });
	}
};

var hide = function hide() {
	store.dispatch({ type: 'HIDE' });
};

var accept = function accept() {
	var state = store.getState();
	var value = getSelectedValue(state);

	if (value === null || value === undefined) {
		return;
	}

	var _getOptions = getOptions(state),
	    accept = _getOptions.accept;

	accept(value);
};

var findToggle = function findToggle() {
	var findInput = document.querySelector('#sparkling-project-find #sparkling-input');
	var replaceInput = document.querySelector('#sparkling-project-replace #sparkling-input');

	if (findInput && findInput !== document.activeElement) {
		findInput.focus();
	} else if (replaceInput && replaceInput !== document.activeElement) {
		replaceInput.focus();
	} else if (isFindVisible(store.getState())) {
		store.dispatch({ type: 'HIDE_SEARCH' });
	} else {
		var editor = atom.workspace.getActiveTextEditor();
		var find = editor ? editor.getSelectedText() : '';
		store.dispatch({ type: 'SHOW_SEARCH', payload: { find: find } });
	}
};

var lsShow = function lsShow() {
	var activeTextEditor = atom.workspace.getActiveTextEditor();
	var finalPath = activeTextEditor ? path.dirname(activeTextEditor.getPath()) : atom.project.getPaths()[0];
	ls({ path: finalPath });
};

var lsShowUp = function lsShowUp() {
	var _getOptions2 = getOptions(store.getState()),
	    optionsPath = _getOptions2.path;

	var finalPath = path.resolve(optionsPath, '..');
	ls({ path: finalPath });
};

function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
var isScheduler_2 = isScheduler;
//# sourceMappingURL=isScheduler.js.map

var isScheduler_1 = {
	isScheduler: isScheduler_2
};

var __extends$2 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ScalarObservable = (function (_super) {
    __extends$2(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
        _super.call(this);
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
        if (scheduler) {
            this._isScalar = false;
        }
    }
    ScalarObservable.create = function (value, scheduler) {
        return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
        var done = state.done, value = state.value, subscriber = state.subscriber;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
        var value = this.value;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value: value, subscriber: subscriber
            });
        }
        else {
            subscriber.next(value);
            if (!subscriber.closed) {
                subscriber.complete();
            }
        }
    };
    return ScalarObservable;
}(Observable_1.Observable));
var ScalarObservable_2 = ScalarObservable;
//# sourceMappingURL=ScalarObservable.js.map

var ScalarObservable_1 = {
	ScalarObservable: ScalarObservable_2
};

var __extends$3 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var EmptyObservable = (function (_super) {
    __extends$3(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following to the console:
     * // x is equal to the count on the interval eg(0,1,2,3,...)
     * // x will occur every 1000ms
     * // if x % 2 is equal to 1 print abc
     * // if x % 2 is not equal to 1 nothing will be output
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
        var subscriber = arg.subscriber;
        subscriber.complete();
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        }
        else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_1.Observable));
var EmptyObservable_2 = EmptyObservable;
//# sourceMappingURL=EmptyObservable.js.map

var EmptyObservable_1 = {
	EmptyObservable: EmptyObservable_2
};

var __extends$4 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayObservable = (function (_super) {
    __extends$4(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
        return new ArrayObservable(array, scheduler);
    };
    /**
     * Creates an Observable that emits some values you specify as arguments,
     * immediately one after the other, and then emits a complete notification.
     *
     * <span class="informal">Emits the arguments you provide, then completes.
     * </span>
     *
     * <img src="./img/of.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the arguments given, and the complete notification thereafter. It can
     * be used for composing with other Observables, such as with {@link concat}.
     * By default, it uses a `null` IScheduler, which means the `next`
     * notifications are sent synchronously, although with a different IScheduler
     * it is possible to determine when those notifications will be delivered.
     *
     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
     * var numbers = Rx.Observable.of(10, 20, 30);
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var interval = Rx.Observable.interval(1000);
     * var result = numbers.concat(letters).concat(interval);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link throw}
     *
     * @param {...T} values Arguments that represent `next` values to be emitted.
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable<T>} An Observable that emits each given input value.
     * @static true
     * @name of
     * @owner Observable
     */
    ArrayObservable.of = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
        }
        else {
            return new EmptyObservable_1.EmptyObservable(scheduler);
        }
    };
    ArrayObservable.dispatch = function (state) {
        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array, index: index, count: count, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_1.Observable));
var ArrayObservable_2 = ArrayObservable;
//# sourceMappingURL=ArrayObservable.js.map

var ArrayObservable_1 = {
	ArrayObservable: ArrayObservable_2
};

var __extends$5 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = (function (_super) {
    __extends$5(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
var OuterSubscriber_2 = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map

var OuterSubscriber_1 = {
	OuterSubscriber: OuterSubscriber_2
};

var isArrayLike_1 = (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArrayLike.js.map

var isArrayLike = {
	isArrayLike: isArrayLike_1
};

function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
var isPromise_2 = isPromise;
//# sourceMappingURL=isPromise.js.map

var isPromise_1 = {
	isPromise: isPromise_2
};

var iterator = createCommonjsModule(function (module, exports) {
function symbolIteratorPonyfill(root) {
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root.Map;
        // required for compatability with es6-shim
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
exports.symbolIteratorPonyfill = symbolIteratorPonyfill;
exports.iterator = symbolIteratorPonyfill(root$4.root);
/**
 * @deprecated use iterator instead
 */
exports.$$iterator = exports.iterator;
//# sourceMappingURL=iterator.js.map
});

var iterator_1 = iterator.symbolIteratorPonyfill;
var iterator_2 = iterator.iterator;
var iterator_3 = iterator.$$iterator;

var __extends$6 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = (function (_super) {
    __extends$6(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
var InnerSubscriber_2 = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map

var InnerSubscriber_1 = {
	InnerSubscriber: InnerSubscriber_2
};

function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            destination.syncErrorThrowable = true;
            return result.subscribe(destination);
        }
    }
    else if (isArrayLike.isArrayLike(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root$4.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (result && typeof result[iterator.iterator] === 'function') {
        var iterator$$1 = result[iterator.iterator]();
        do {
            var item = iterator$$1.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (result && typeof result[observable.observable] === 'function') {
        var obs = result[observable.observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = ("You provided " + value + " where a stream was expected.")
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
var subscribeToResult_2 = subscribeToResult;
//# sourceMappingURL=subscribeToResult.js.map

var subscribeToResult_1 = {
	subscribeToResult: subscribeToResult_2
};

var __extends$7 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




var none = {};
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are
 * calculated from the latest values of each of its input Observables.
 *
 * <span class="informal">Whenever any input Observable emits a value, it
 * computes a formula using the latest values from all the inputs, then emits
 * the output of that formula.</span>
 *
 * <img src="./img/combineLatest.png" width="100%">
 *
 * `combineLatest` combines the values from this Observable with values from
 * Observables passed as arguments. This is done by subscribing to each
 * Observable, in order, and collecting an array of each of the most recent
 * values any time any of the input Observables emits, then either taking that
 * array and passing it as arguments to an optional `project` function and
 * emitting the return value of that, or just emitting the array of recent
 * values directly if there is no `project` function.
 *
 * @example <caption>Dynamically calculate the Body-Mass Index from an Observable of weight and one for height</caption>
 * var weight = Rx.Observable.of(70, 72, 76, 79, 75);
 * var height = Rx.Observable.of(1.76, 1.77, 1.78);
 * var bmi = weight.combineLatest(height, (w, h) => w / (h * h));
 * bmi.subscribe(x => console.log('BMI is ' + x));
 *
 * // With output to console:
 * // BMI is 24.212293388429753
 * // BMI is 23.93948099205209
 * // BMI is 23.671253629592222
 *
 * @see {@link combineAll}
 * @see {@link merge}
 * @see {@link withLatestFrom}
 *
 * @param {ObservableInput} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {function} [project] An optional function to project the values from
 * the combined latest values into a new value on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method combineLatest
 * @owner Observable
 */
function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray.isArray(observables[0])) {
        observables = observables[0].slice();
    }
    return function (source) { return source.lift.call(new ArrayObservable_1.ArrayObservable([source].concat(observables)), new CombineLatestOperator(project)); };
}
var combineLatest_2 = combineLatest;
var CombineLatestOperator = (function () {
    function CombineLatestOperator(project) {
        this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
}());
var CombineLatestOperator_1 = CombineLatestOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CombineLatestSubscriber = (function (_super) {
    __extends$7(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
        _super.call(this, destination);
        this.project = project;
        this.active = 0;
        this.values = [];
        this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
        this.values.push(none);
        this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            this.active = len;
            this.toRespond = len;
            for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
            }
        }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
        if ((this.active -= 1) === 0) {
            this.destination.complete();
        }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var values = this.values;
        var oldVal = values[outerIndex];
        var toRespond = !this.toRespond
            ? 0
            : oldVal === none ? --this.toRespond : this.toRespond;
        values[outerIndex] = innerValue;
        if (toRespond === 0) {
            if (this.project) {
                this._tryProject(values);
            }
            else {
                this.destination.next(values.slice());
            }
        }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
        var result;
        try {
            result = this.project.apply(this, values);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return CombineLatestSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
var CombineLatestSubscriber_1 = CombineLatestSubscriber;
//# sourceMappingURL=combineLatest.js.map

var combineLatest_1 = {
	combineLatest: combineLatest_2,
	CombineLatestOperator: CombineLatestOperator_1,
	CombineLatestSubscriber: CombineLatestSubscriber_1
};

function combineLatest$1() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var project = null;
    var scheduler = null;
    if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        project = observables.pop();
    }
    // if the first and only other argument besides the resultSelector is an array
    // assume it's been called with `combineLatest([obs1, obs2, obs3], project)`
    if (observables.length === 1 && isArray.isArray(observables[0])) {
        observables = observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new combineLatest_1.CombineLatestOperator(project));
}
var combineLatest_3 = combineLatest$1;
//# sourceMappingURL=combineLatest.js.map

var combineLatest_2$1 = {
	combineLatest: combineLatest_3
};

Observable_1.Observable.combineLatest = combineLatest_2$1.combineLatest;
//# sourceMappingURL=combineLatest.js.map

var __extends$8 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // a0
 * // b0
 * // c0
 * // a1
 * // b1
 * // c1
 * // continues to list a,b,c with respective ascending integers
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return function mergeMapOperatorFunction(source) {
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
        }
        return source.lift(new MergeMapOperator(project, resultSelector, concurrent));
    };
}
var mergeMap_2 = mergeMap;
var MergeMapOperator = (function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    };
    return MergeMapOperator;
}());
var MergeMapOperator_1 = MergeMapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeMapSubscriber = (function (_super) {
    __extends$8(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
var MergeMapSubscriber_1 = MergeMapSubscriber;
//# sourceMappingURL=mergeMap.js.map

var mergeMap_1 = {
	mergeMap: mergeMap_2,
	MergeMapOperator: MergeMapOperator_1,
	MergeMapSubscriber: MergeMapSubscriber_1
};

function identity(x) {
    return x;
}
var identity_2 = identity;
//# sourceMappingURL=identity.js.map

var identity_1 = {
	identity: identity_2
};

function mergeAll(concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return mergeMap_1.mergeMap(identity_1.identity, null, concurrent);
}
var mergeAll_2 = mergeAll;
//# sourceMappingURL=mergeAll.js.map

var mergeAll_1 = {
	mergeAll: mergeAll_2
};

function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (isScheduler_1.isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable_1.Observable) {
        return observables[0];
    }
    return mergeAll_1.mergeAll(concurrent)(new ArrayObservable_1.ArrayObservable(observables, scheduler));
}
var merge_2 = merge;
//# sourceMappingURL=merge.js.map

var merge_1 = {
	merge: merge_2
};

Observable_1.Observable.merge = merge_1.merge;
//# sourceMappingURL=merge.js.map

var __extends$9 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * A unit of work to be executed in a {@link Scheduler}. An action is typically
 * created from within a Scheduler and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
var Action = (function (_super) {
    __extends$9(Action, _super);
    function Action(scheduler, work) {
        _super.call(this);
    }
    /**
     * Schedules this action on its parent Scheduler for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        return this;
    };
    return Action;
}(Subscription_1.Subscription));
var Action_2 = Action;
//# sourceMappingURL=Action.js.map

var Action_1 = {
	Action: Action_2
};

var __extends$10 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsyncAction = (function (_super) {
    __extends$10(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        // Set the pending flag indicating that this action has been scheduled, or
        // has recursively rescheduled itself.
        this.pending = true;
        var id = this.id;
        var scheduler = this.scheduler;
        //
        // Important implementation note:
        //
        // Actions only execute once by default, unless rescheduled from within the
        // scheduled callback. This allows us to implement single and repeat
        // actions via the same code path, without adding API surface area, as well
        // as mimic traditional recursion but across asynchronous boundaries.
        //
        // However, JS runtimes and timers distinguish between intervals achieved by
        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
        // serial `setTimeout` calls can be individually delayed, which delays
        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
        // guarantee the interval callback will be invoked more precisely to the
        // interval period, regardless of load.
        //
        // Therefore, we use `setInterval` to schedule single and repeat actions.
        // If the action reschedules itself with the same delay, the interval is not
        // canceled. If the action doesn't reschedule, or reschedules with a
        // different delay, the interval will be canceled after scheduled callback
        // execution.
        //
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.delay = delay;
        // If this action has already an async Id, don't request a new one.
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        return root$4.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // or the action has been rescheduled before it's executed, clear the interval id
        return root$4.root.clearInterval(id) && undefined || undefined;
    };
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            // Dequeue if the action didn't reschedule itself. Don't call
            // unsubscribe(), because the action could reschedule later.
            // For example:
            // ```
            // scheduler.schedule(function doWork(counter) {
            //   /* ... I'm a busy worker bee ... */
            //   var originalAction = this;
            //   /* wait 100ms before rescheduling the action */
            //   setTimeout(function () {
            //     originalAction.schedule(counter + 1);
            //   }, 100);
            // }, 1000);
            // ```
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(Action_1.Action));
var AsyncAction_2 = AsyncAction;
//# sourceMappingURL=AsyncAction.js.map

var AsyncAction_1 = {
	AsyncAction: AsyncAction_2
};

var Scheduler = (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = Date.now ? Date.now : function () { return +new Date(); };
    return Scheduler;
}());
var Scheduler_2 = Scheduler;
//# sourceMappingURL=Scheduler.js.map

var Scheduler_1 = {
	Scheduler: Scheduler_2
};

var __extends$11 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var AsyncScheduler = (function (_super) {
    __extends$11(AsyncScheduler, _super);
    function AsyncScheduler() {
        _super.apply(this, arguments);
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift()); // exhaust the scheduler queue
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler_1.Scheduler));
var AsyncScheduler_2 = AsyncScheduler;
//# sourceMappingURL=AsyncScheduler.js.map

var AsyncScheduler_1 = {
	AsyncScheduler: AsyncScheduler_2
};

var async_1 = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
//# sourceMappingURL=async.js.map

var async = {
	async: async_1
};

var __extends$12 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Ignores source values for a duration determined by another Observable, then
 * emits the most recent value from the source Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link auditTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * <img src="./img/audit.png" width="100%">
 *
 * `audit` is similar to `throttle`, but emits the last value from the silenced
 * time window, instead of the first value. `audit` emits the most recent value
 * from the source Observable on the output Observable as soon as its internal
 * timer becomes disabled, and ignores source values while the timer is enabled.
 * Initially, the timer is disabled. As soon as the first source value arrives,
 * the timer is enabled by calling the `durationSelector` function with the
 * source value, which returns the "duration" Observable. When the duration
 * Observable emits a value or completes, the timer is disabled, then the most
 * recent source value is emitted on the output Observable, and this process
 * repeats for the next source value.
 *
 * @example <caption>Emit clicks at a rate of at most one click per second</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.audit(ev => Rx.Observable.interval(1000));
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttle}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method audit
 * @owner Observable
 */
function audit(durationSelector) {
    return function auditOperatorFunction(source) {
        return source.lift(new AuditOperator(durationSelector));
    };
}
var audit_2 = audit;
var AuditOperator = (function () {
    function AuditOperator(durationSelector) {
        this.durationSelector = durationSelector;
    }
    AuditOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
    };
    return AuditOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AuditSubscriber = (function (_super) {
    __extends$12(AuditSubscriber, _super);
    function AuditSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
    }
    AuditSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            var duration = tryCatch_1.tryCatch(this.durationSelector)(value);
            if (duration === errorObject.errorObject) {
                this.destination.error(errorObject.errorObject.e);
            }
            else {
                var innerSubscription = subscribeToResult_1.subscribeToResult(this, duration);
                if (innerSubscription.closed) {
                    this.clearThrottle();
                }
                else {
                    this.add(this.throttled = innerSubscription);
                }
            }
        }
    };
    AuditSubscriber.prototype.clearThrottle = function () {
        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    };
    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    };
    AuditSubscriber.prototype.notifyComplete = function () {
        this.clearThrottle();
    };
    return AuditSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=audit.js.map

var audit_1 = {
	audit: audit_2
};

function isNumeric(val) {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !isArray.isArray(val) && (val - parseFloat(val) + 1) >= 0;
}
var isNumeric_2 = isNumeric;

//# sourceMappingURL=isNumeric.js.map

var isNumeric_1 = {
	isNumeric: isNumeric_2
};

function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
var isDate_2 = isDate;
//# sourceMappingURL=isDate.js.map

var isDate_1 = {
	isDate: isDate_2
};

var __extends$13 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};





/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var TimerObservable = (function (_super) {
    __extends$13(TimerObservable, _super);
    function TimerObservable(dueTime, period, scheduler) {
        if (dueTime === void 0) { dueTime = 0; }
        _super.call(this);
        this.period = -1;
        this.dueTime = 0;
        if (isNumeric_1.isNumeric(period)) {
            this.period = Number(period) < 1 && 1 || Number(period);
        }
        else if (isScheduler_1.isScheduler(period)) {
            scheduler = period;
        }
        if (!isScheduler_1.isScheduler(scheduler)) {
            scheduler = async.async;
        }
        this.scheduler = scheduler;
        this.dueTime = isDate_1.isDate(dueTime) ?
            (+dueTime - this.scheduler.now()) :
            dueTime;
    }
    /**
     * Creates an Observable that starts emitting after an `initialDelay` and
     * emits ever increasing numbers after each `period` of time thereafter.
     *
     * <span class="informal">Its like {@link interval}, but you can specify when
     * should the emissions start.</span>
     *
     * <img src="./img/timer.png" width="100%">
     *
     * `timer` returns an Observable that emits an infinite sequence of ascending
     * integers, with a constant interval of time, `period` of your choosing
     * between those emissions. The first emission happens after the specified
     * `initialDelay`. The initial delay may be a {@link Date}. By default, this
     * operator uses the `async` IScheduler to provide a notion of time, but you
     * may pass any IScheduler to it. If `period` is not specified, the output
     * Observable emits only one value, `0`. Otherwise, it emits an infinite
     * sequence.
     *
     * @example <caption>Emits ascending numbers, one every second (1000ms), starting after 3 seconds</caption>
     * var numbers = Rx.Observable.timer(3000, 1000);
     * numbers.subscribe(x => console.log(x));
     *
     * @example <caption>Emits one number after five seconds</caption>
     * var numbers = Rx.Observable.timer(5000);
     * numbers.subscribe(x => console.log(x));
     *
     * @see {@link interval}
     * @see {@link delay}
     *
     * @param {number|Date} initialDelay The initial delay time to wait before
     * emitting the first value of `0`.
     * @param {number} [period] The period of time between emissions of the
     * subsequent numbers.
     * @param {Scheduler} [scheduler=async] The IScheduler to use for scheduling
     * the emission of values, and providing a notion of "time".
     * @return {Observable} An Observable that emits a `0` after the
     * `initialDelay` and ever increasing numbers after each `period` of time
     * thereafter.
     * @static true
     * @name timer
     * @owner Observable
     */
    TimerObservable.create = function (initialDelay, period, scheduler) {
        if (initialDelay === void 0) { initialDelay = 0; }
        return new TimerObservable(initialDelay, period, scheduler);
    };
    TimerObservable.dispatch = function (state) {
        var index = state.index, period = state.period, subscriber = state.subscriber;
        var action = this;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        action.schedule(state, period);
    };
    TimerObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var _a = this, period = _a.period, dueTime = _a.dueTime, scheduler = _a.scheduler;
        return scheduler.schedule(TimerObservable.dispatch, dueTime, {
            index: index, period: period, subscriber: subscriber
        });
    };
    return TimerObservable;
}(Observable_1.Observable));
var TimerObservable_2 = TimerObservable;
//# sourceMappingURL=TimerObservable.js.map

var TimerObservable_1 = {
	TimerObservable: TimerObservable_2
};

var timer_1 = TimerObservable_1.TimerObservable.create;
//# sourceMappingURL=timer.js.map

var timer = {
	timer: timer_1
};

function auditTime(duration, scheduler) {
    if (scheduler === void 0) { scheduler = async.async; }
    return audit_1.audit(function () { return timer.timer(duration, scheduler); });
}
var auditTime_2 = auditTime;
//# sourceMappingURL=auditTime.js.map

var auditTime_1 = {
	auditTime: auditTime_2
};

function auditTime$1(duration, scheduler) {
    if (scheduler === void 0) { scheduler = async.async; }
    return auditTime_1.auditTime(duration, scheduler)(this);
}
var auditTime_3 = auditTime$1;
//# sourceMappingURL=auditTime.js.map

var auditTime_2$1 = {
	auditTime: auditTime_3
};

Observable_1.Observable.prototype.auditTime = auditTime_2$1.auditTime;
//# sourceMappingURL=auditTime.js.map

var __extends$14 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
var map_2 = map;
var MapOperator = (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());
var MapOperator_1 = MapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapSubscriber = (function (_super) {
    __extends$14(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        _super.call(this, destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=map.js.map

var map_1 = {
	map: map_2,
	MapOperator: MapOperator_1
};

function map$1(project, thisArg) {
    return map_1.map(project, thisArg)(this);
}
var map_3 = map$1;
//# sourceMappingURL=map.js.map

var map_2$1 = {
	map: map_3
};

Observable_1.Observable.prototype.map = map_2$1.map;
//# sourceMappingURL=map.js.map

var __extends$15 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};



/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 *
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 *
 * @example <caption>A simple example with numbers</caption>
 * Observable.of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4)
 *   .distinctUntilChanged()
 *   .subscribe(x => console.log(x)); // 1, 2, 1, 2, 3, 4
 *
 * @example <caption>An example using a compare function</caption>
 * interface Person {
 *    age: number,
 *    name: string
 * }
 *
 * Observable.of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'})
 *     { age: 6, name: 'Foo'})
 *     .distinctUntilChanged((p: Person, q: Person) => p.name === q.name)
 *     .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo' }
 *
 * @see {@link distinct}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [compare] Optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
function distinctUntilChanged(compare, keySelector) {
    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
}
var distinctUntilChanged_2 = distinctUntilChanged;
var DistinctUntilChangedOperator = (function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    };
    return DistinctUntilChangedOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctUntilChangedSubscriber = (function (_super) {
    __extends$15(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
        _super.call(this, destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
        return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
        var keySelector = this.keySelector;
        var key = value;
        if (keySelector) {
            key = tryCatch_1.tryCatch(this.keySelector)(value);
            if (key === errorObject.errorObject) {
                return this.destination.error(errorObject.errorObject.e);
            }
        }
        var result = false;
        if (this.hasKey) {
            result = tryCatch_1.tryCatch(this.compare)(this.key, key);
            if (result === errorObject.errorObject) {
                return this.destination.error(errorObject.errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    };
    return DistinctUntilChangedSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=distinctUntilChanged.js.map

var distinctUntilChanged_1 = {
	distinctUntilChanged: distinctUntilChanged_2
};

function distinctUntilChanged$1(compare, keySelector) {
    return distinctUntilChanged_1.distinctUntilChanged(compare, keySelector)(this);
}
var distinctUntilChanged_3 = distinctUntilChanged$1;
//# sourceMappingURL=distinctUntilChanged.js.map

var distinctUntilChanged_2$1 = {
	distinctUntilChanged: distinctUntilChanged_3
};

Observable_1.Observable.prototype.distinctUntilChanged = distinctUntilChanged_2$1.distinctUntilChanged;
//# sourceMappingURL=distinctUntilChanged.js.map

var fromSelector = store.fromSelector;
var fromAction = store.fromAction;


var setupObservables = (function () {
	// let fuzzysortPromise = null
	var cancelLoadData = null;

	Observable_2.combineLatest(fromSelector(getData), fromSelector(getPattern)).auditTime(100).subscribe(function (_ref) {
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
			var filteredData = fuzzaldrin.filter(data, pattern, {
				key: 'value'
			});

			store.dispatch({
				type: 'SET_FILTERED_DATA',
				payload: { data: filteredData }
			});
		}
	});

	Observable_2.merge(fromAction('RELOAD'), fromAction('SHOW')).map(function () {
		return [isVisible(store.getState()), getOptions(store.getState())];
	}).subscribe(function (_ref3) {
		var _ref4 = slicedToArray(_ref3, 2),
		    visible = _ref4[0],
		    options = _ref4[1];

		if (!visible) {
			return;
		}

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

	fromAction('HIDE_SEARCH').subscribe(function () {
		var editor = atom.workspace.getActiveTextEditor();
		var view = editor && atom.views.getView(editor);
		view && view.focus();
	});

	fromAction('HIDE_REPLACE').subscribe(function () {
		var editor = atom.workspace.getActiveTextEditor();
		var view = editor && atom.views.getView(editor);
		view && view.focus();
	});

	fromAction('HIDE').subscribe(function () {
		var editor = atom.workspace.getActiveTextEditor();
		var view = editor && atom.views.getView(editor);
		view && view.focus();

		// if (fuzzysortPromise) {
		// 	fuzzysortPromise.cancel()
		// }

		if (cancelLoadData && typeof cancelLoadData === 'function') {
			cancelLoadData();
			cancelLoadData = null;
		}
	});
});

module.exports = {
	subscriptions: null,

	config: config,

	commands: [{ id: 'files', command: files }, { id: 'gitFiles', command: gitFiles }, { id: 'gitStage', command: gitStage }, { id: 'gitBranches', command: gitBranches }, { id: 'lines', command: lines }, { id: 'allLines', command: allLines }, { id: 'autocompleteLines', command: autocompleteLines }, { id: 'find', command: find$1 }, { id: 'replace', command: replace$1 }],

	provideSparkling: function provideSparkling() {
		return commandFactory;
	},
	setup: function setup() {
		var reactRoot = document.createElement('div');

		render(h(
			Provider,
			{ store: store },
			h(
				'div',
				null,
				h(SparklingContainer$1, null),
				h(FindContainer$1, null)
			)
		), reactRoot);

		setupObservables();

		atom.workspace.addBottomPanel({ item: reactRoot, model: {} });

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'sparkling:next': next,
			'sparkling:previous': previous,
			'sparkling:accept': accept,
			'sparkling:hide': hide
		}));

		var workspaceView = atom.views.getView(atom.workspace);

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'sparkling:findToggle': findToggle
		}));

		atom.commands.add('atom-workspace', {
			'sparkling:ls': lsShow
		});

		atom.commands.add('atom-workspace', {
			'sparkling:lsUp': lsShowUp
		});

		this.commands.forEach(function (commandConfig) {
			var id = commandConfig.id,
			    command = commandConfig.command;

			atom.config.observe('sparkling.' + commandConfig.id, function (value) {
				if (value) {
					commandConfig.subscription = atom.commands.add('atom-workspace', defineProperty({}, 'sparkling:' + id, function undefined() {
						return command();
					}));
					workspaceView.classList.add('sparkling-' + id);
				} else {
					var subscription = commandConfig.subscription;

					subscription && subscription.dispose();
					workspaceView.classList.remove('sparkling-' + id);
				}
			});
		});
	},
	activate: function activate() {
		var _this = this;

		this.subscriptions = new atom$1.CompositeDisposable();

		if (atom.packages.hasActivatedInitialPackages()) {
			this.setup();
		} else {
			this.subscriptions.add(atom.packages.onDidActivateInitialPackages(function () {
				return _this.setup();
			}));
		}
	},
	deactivate: function deactivate() {
		this.subscriptions.dispose();
		this.commands.forEach(function (commandConfig) {
			var subscription = commandConfig.subscription;

			subscription && subscription.dispose();
		});
	},
	serialize: function serialize() {
		return {};
	},
	consumeFileIcons: function consumeFileIcons(service) {
		setFileIconsService(service);
	}
};
