'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var child_process = require('child_process');
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

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

var escapeHTML = function escapeHTML(str) {
	return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
		return '&#' + i.charCodeAt(0) + ';';
	});
};

var spawnInProject = function spawnInProject(cmd, args) {
	var cwd = atom.project.getPaths()[0];
	return child_process.spawn(cmd, args, {
		cwd: cwd
	});
};

var endOfMultilineMatchRegex = /(\d+);(\d+) (\d+):(.*)/;

var ackmateDFA = {
	initial: function initial(line, state) {
		return line[0] === ':' ? { type: 'inFile', state: _extends({}, state, { fileName: line.slice(1) }) } : { type: 'error', state: state };
	},
	inMultilineMatch: function inMultilineMatch(line, state) {
		var regexMatch = endOfMultilineMatchRegex.exec(line);

		var startLine = state.startLine,
		    fileName = state.fileName,
		    lines = state.lines;


		if (!lines || startLine === undefined || startLine === null || !fileName) {
			throw new Error('Error during parsing of ackmate format');
		}

		if (regexMatch) {
			var _endLine = parseInt(regexMatch[1]);
			var _startColumn = parseInt(regexMatch[2]);
			var matchLength = parseInt(regexMatch[3]);
			var fileLine = regexMatch[4];
			var _endColumn = matchLength + _startColumn - lines.join('\n').length - 1;
			var joinedLines = [].concat(toConsumableArray(lines), [fileLine]).join('\n');
			var _match = joinedLines.slice(_startColumn, _startColumn + matchLength);

			state.processedData.push({
				value: joinedLines,
				match: _match,
				path: fileName,
				startLine: startLine,
				startColumn: _startColumn,
				endLine: _endLine,
				endColumn: _endColumn
			});

			return { type: 'inFile', state: state };
		}

		var _line$split = line.split(';'),
		    _line$split2 = toArray(_line$split),
		    splitRestDataLine = _line$split2.slice(1);

		return {
			type: 'inMultilineMatch',
			state: _extends({}, state, {
				lines: [].concat(toConsumableArray(state.lines || []), [splitRestDataLine.join(';')])
			})
		};
	},
	inFile: function inFile(line, state) {
		if (line === '') {
			return {
				type: 'initial',
				state: state
			};
		}

		var regex = /(\d+);((\d+ \d+,?)+):(.*)/;

		var regexMatch = regex.exec(line);

		if (!regexMatch) {
			return {
				type: 'inMultilineMatch',
				state: _extends({}, state, {
					lines: [line.split(';').slice(1).join('')],
					startLine: parseInt(line.split(';')[0])
				})
			};
		}

		var startLine = parseInt(regexMatch[1]);
		var endLine = startLine;
		var matches = regexMatch[2].split(',');
		var fileLine = regexMatch[regexMatch.length - 1];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _match2 = _step.value;

				var _match2$split = _match2.split(' '),
				    _match2$split2 = slicedToArray(_match2$split, 2),
				    startStr = _match2$split2[0],
				    lengthStr = _match2$split2[1];

				var _startColumn2 = parseInt(startStr);
				var _endColumn2 = parseInt(lengthStr) + _startColumn2;
				var _fileName = state.fileName;

				if (_fileName) {
					state.processedData.push({
						value: fileLine,
						match: fileLine.slice(_startColumn2, _endColumn2),
						path: _fileName,
						startLine: startLine,
						startColumn: _startColumn2,
						endLine: endLine,
						endColumn: _endColumn2
					});
				} else {
					throw new Error('Error during parsing of ackmate format');
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

		return { type: 'inFile', state: state };
	},
	error: function error(line, state) {
		return { type: 'error', state: state };
	}
};

var ackmateParser = function ackmateParser(lines) {
	var node = {
		type: 'initial',
		state: {
			processedData: []
		}
	};

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _line = _step2.value;

			node = ackmateDFA[node.type](_line, node.state);
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return node.state.processedData;
};

var parse = function parse(text) {
	var _require = require('babylon'),
	    parse = _require.parse;

	var tokens = [];

	try {
		var ast = parse(text, {
			sourceType: 'module',
			plugins: ['objectRestSpread', 'asyncGenerators', 'jsx', 'flow', 'classProperties', 'exportExtensions']
		});
		tokens = ast.tokens;
	} catch (e) {
		tokens = sillyParse(text);
	}

	return tokens;
};

var sillyParse = function sillyParse(text) {
	var tokens = [];
	var match = void 0;
	var lines = text.split('\n');
	lines.forEach(function (line, lineNumber) {
		var tokenRegex = /(("|'|`)([^"'`])*\2)|([^\s,\[\]\(\)\:{}=\.;]+|,|\[|\]|\(|\)|\:|{|}|=\>|=|\.|;)/g;
		while (match = tokenRegex.exec(line)) {
			if (!match) {
				break;
			}
			tokens.push({
				type: {
					label: match[0]
				},
				loc: {
					start: {
						line: lineNumber + 1,
						column: match.index
					},
					end: {
						line: lineNumber + 1,
						column: match.index + match[0].length
					}
				}
			});
		}
	});

	return tokens;
};

function toAtomRange(_ref2) {
	var start = _ref2.start,
	    end = _ref2.end;

	return [[start.line - 1, start.column], [end.line - 1, end.column]];
}

var loadData = (function (onData) {
	var cmdProcess = spawnInProject('rg', ['--files', '--hidden', '--glob', '!.git/*']);
	cmdProcess.stdout.on('data', function (data) {
		onData(data.toString('utf-8').split('\n').filter(function (s) {
			return s.length > 1;
		}).map(function (value) {
			return { value: value };
		}));
	});

	return function () {
		// cmdProcess.stdin.pause()
		cmdProcess.kill();
	};
});

var defaultRendererFactory = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    wrap = _ref.wrap;
	return function (_ref2) {
		var item = _ref2.item,
		    pattern = _ref2.pattern,
		    className = _ref2.className,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex,
		    accept = _ref2.accept;
		var value = item.value;


		var finalClassName = classnames(className, 'sparkling-row', defineProperty({}, 'sparkling-row--selected', index === selectedIndex));

		var wrappedValue = wrap(value, pattern);

		return React.createElement('div', {
			className: finalClassName,
			'aria-role': 'button',
			onClick: function onClick() {
				return accept(item);
			},
			dangerouslySetInnerHTML: { __html: wrappedValue }
		});
	};
});

var rendererFactory = (function (dependencies) {
	var classnames = dependencies.classnames,
	    iconClassForPath = dependencies.utils.iconClassForPath;

	var defaultRenderer = defaultRendererFactory(dependencies);

	return function (props) {
		return defaultRenderer(_extends({}, props, {
			className: classnames.apply(undefined, ['icon'].concat(toConsumableArray(iconClassForPath(props.item.value))))
		}));
	};
});

var files = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory(dependencies);

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

var loadDataFactory = (function (_ref) {
	var store = _ref.store;
	return function (onData) {
		var options = getOptions(store.getState());
		var activeElement = options.activeElement;


		var commands = atom.commands.findCommands({
			target: activeElement
		});

		var keybindings = atom.keymaps.findKeyBindings({
			target: activeElement
		});

		var keybindingsMap = keybindings.reduce(function (acc, keybinding) {
			acc[keybinding.command] = keybinding;
			return acc;
		}, {});

		onData(commands.sort(function (a, b) {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			}

			return 0;
		}).map(function (_ref2) {
			var displayName = _ref2.displayName,
			    name = _ref2.name;

			var keybinding = keybindingsMap[name];

			return {
				value: displayName,
				name: name,
				keybinding: keybinding,
				activeElement: activeElement
			};
		}));
		return function () {};
	};
});

var iconMap = {
	alt: '⌥',
	cmd: '⌘',
	shift: '⇧',
	ctrl: '⌃',
	tab: '⇥',
	up: '↑',
	down: '↓',
	left: '←',
	right: '→',
	enter: '↵',
	escape: 'esc'
};

var commands = (function (dependencies) {
	var React = dependencies.React,
	    classnames = dependencies.classnames,
	    wrap = dependencies.wrap,
	    store = dependencies.store;


	var loadData = loadDataFactory(dependencies);

	var accept = function accept(item) {
		atom.commands.dispatch(item.activeElement, item.name);
		store.dispatch({ type: 'HIDE' });
	};

	var renderer = function renderer(_ref) {
		var item = _ref.item,
		    index = _ref.index,
		    selectedIndex = _ref.selectedIndex,
		    pattern = _ref.pattern;

		var keybinding = item.keybinding;
		var finalClassName = classnames('sparkling-row', defineProperty({}, 'sparkling-row--selected', index === selectedIndex));

		var wrappedValue = wrap(item.value, pattern);

		return React.createElement(
			'div',
			{
				className: finalClassName,
				'aria-role': 'button',
				onClick: function onClick() {
					return accept(item);
				},
				style: { display: 'flex', justifyContent: 'space-between' } },
			React.createElement('span', { dangerouslySetInnerHTML: { __html: wrappedValue } }),
			keybinding && React.createElement(
				'span',
				null,
				keybinding.keystrokeArray.map(function (keystroke) {
					return React.createElement(
						'span',
						{ className: 'sparkling-keystroke' },
						keystroke.split('-').map(function (key) {
							if (iconMap[key]) {
								return iconMap[key];
							}

							return key;
						}).join(' ')
					);
				})
			)
		);
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 12,
		columns: 2,
		description: 'Run commands',
		id: 'sparkling-commands'
	};
});

var tokens = (function (dependencies) {
	var React = dependencies.React,
	    store = dependencies.store,
	    fromSelector = dependencies.fromSelector,
	    withSideEffect = dependencies.components.withSideEffect;


	var loadData = function loadData(onData) {
		var editor = atom.workspace.getActiveTextEditor();
		var text = editor.getText();
		var tokens = parse(text);

		onData(tokens.map(function (token) {
			var range = toAtomRange(token.loc);
			return {
				value: editor.getTextInBufferRange(range),
				range: range
			};
		}).filter(function (token) {
			return token.value && token.value.length > 3;
		}));

		return function () {};
	};

	var onToken = function onToken(token) {
		if (!token || !token.range) {
			return;
		}

		var editor = atom.workspace.getActiveTextEditor();
		editor.setSelectedBufferRange(token.range);
	};

	var TokenSideEffect = withSideEffect(fromSelector(getSelectedValue))(onToken)(function () {
		return null;
	});

	var accept = function accept(token) {
		store.dispatch({ type: 'HIDE' });
		onToken(token);
	};

	return {
		loadData: loadData,
		accept: accept,
		childrenRenderer: function childrenRenderer() {
			return React.createElement(TokenSideEffect, null);
		},
		description: 'Find tokens in current buffer',
		id: 'sparkling-buffer-tokens',
		columns: 15,
		sliceLength: 60
	};
});

var loadDataFactory$1 = (function (store) {
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
			// cmdProcess.stdin.pause()
			cmdProcess.kill();
		};
	};
});

var rendererFactory$1 = (function (dependencies) {
	var iconClassForPath = dependencies.utils.iconClassForPath;

	var defaultRenderer = defaultRendererFactory(dependencies);
	return function (props) {
		var absolutePath = props.item.absolutePath;


		return defaultRenderer(_extends({}, props, {
			className: ['icon'].concat(toConsumableArray(iconClassForPath(absolutePath)))
		}));
	};
});

var ls = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$1(dependencies);

	var loadData = loadDataFactory$1(store);

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
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Project navigation',
		id: 'sparkling-ls'
	};
});

var loadEmojiFactory = (function () {
	return function (onData) {
		var emoji = require('../db/emoji.json');
		onData(emoji.map(function (_ref) {
			var emoji = _ref.emoji,
			    category = _ref.category,
			    tags = _ref.tags,
			    aliases = _ref.aliases,
			    description = _ref.description;
			return {
				emoji: emoji,
				value: category + ' ' + tags + ' ' + aliases + ' ' + description
			};
		}));

		return function () {};
	};
});

var rendererFactory$2 = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames;

	return function (_ref2) {
		var item = _ref2.item,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex;
		var emoji = item.emoji;


		return React.createElement(
			'div',
			{
				className: classnames('sparkling-emoji', {
					'sparkling-emoji-highlight': index === selectedIndex
				})
			},
			emoji
		);
	};
});

var emoji = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$2(dependencies);

	var loadData = loadEmojiFactory();

	var accept = function accept(_ref) {
		var emoji = _ref.emoji;

		var editor = atom.workspace.getActiveTextEditor();

		store.dispatch({ type: 'HIDE' });
		editor.insertText(emoji);
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 100,
		columns: 20,
		description: 'Emoji insertion',
		id: 'sparkling-emoji'
	};
});

var copyFiles = (function (dependencies) {
	var renderer = rendererFactory(dependencies);

	var store = dependencies.store;


	var accept = function accept(file) {
		store.dispatch({
			type: 'SHOW_EXTRA_INPUT',
			payload: {
				id: 'sparkling-copy-file-confirm',
				value: file.value,
				originPath: file.value
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

var moveFiles = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory(dependencies);

	var accept = function accept(file) {
		store.dispatch({
			type: 'SHOW_EXTRA_INPUT',
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

var removeFiles = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory(dependencies);

	var accept = function accept(item) {
		spawnInProject('rm', [item.value]);

		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: { item: item }
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

var relativePathInsert = (function (dependencies) {
	var renderer = rendererFactory(dependencies);

	var store = dependencies.store;


	var accept = function accept(_ref) {
		var value = _ref.value;

		var editor = atom.workspace.getActiveTextEditor();
		var projectPath = atom.project.getPaths()[0];
		var originPath = editor.getPath();
		var dir = path.dirname(originPath);
		var targetPath = path.resolve(projectPath, value);
		var relativePath = path.relative(dir, targetPath);

		if (relativePath.slice(-3) === '.js') {
			relativePath = relativePath.slice(0, -3);
		}

		if (relativePath.slice(-6) === '/index') {
			relativePath = relativePath.slice(0, -6);
		}

		if (relativePath[0] !== '.') {
			relativePath = './' + relativePath;
		}

		store.dispatch({ type: 'HIDE' });
		editor.insertText(relativePath);
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Copy relative path',
		id: 'sparkling-copy-relative-path'
	};
});

var relativePathCopy = (function (dependencies) {
	var renderer = rendererFactory(dependencies);

	var store = dependencies.store;


	var accept = function accept(_ref) {
		var value = _ref.value;

		var editor = atom.workspace.getActiveTextEditor();
		var projectPath = atom.project.getPaths()[0];
		var originPath = editor.getPath();
		var dir = path.dirname(originPath);
		var targetPath = path.resolve(projectPath, value);
		var relativePath = path.relative(dir, targetPath);

		if (relativePath.slice(-3) === '.js') {
			relativePath = relativePath.slice(0, -3);
		}

		if (relativePath[0] !== '.') {
			relativePath = './' + relativePath;
		}

		store.dispatch({ type: 'HIDE' });
		atom.clipboard.write(relativePath);
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Copy relative path',
		id: 'sparkling-copy-relative-path'
	};
});

var loadDataFactory$2 = (function () {
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

		return function () {
			// cmdProcess.stdin.pause()
			cmdProcess.kill();
		};
	};
});

var rendererFactory$3 = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    wrap = _ref.wrap,
	    iconClassForPath = _ref.utils.iconClassForPath;
	return function (_ref2) {
		var item = _ref2.item,
		    pattern = _ref2.pattern,
		    className = _ref2.className,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex,
		    accept = _ref2.accept;
		var value = item.value,
		    status = item.status;


		var finalClassName = classnames(className, 'sparkling-row', ['icon'].concat(toConsumableArray(iconClassForPath(value))), defineProperty({}, 'sparkling-row--selected', index === selectedIndex));

		var wrappedValue = wrap(value, pattern);

		var statusLabel = void 0;

		if (status === 'M ') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-modified-staged' },
				'modified'
			);
		} else if (status === ' M') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-modified' },
				'modified'
			);
		} else if (status === 'MM') {
			statusLabel = [React.createElement(
				'span',
				{ className: 'git-status-modified-staged' },
				'modi'
			), React.createElement(
				'span',
				{ className: 'git-status-modified' },
				'fied'
			)];
		} else if (status === '??') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-untracked' },
				'untracked'
			);
		} else if (status === 'D ') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-deleted-staged' },
				'deleted'
			);
		} else if (status === ' D') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-deleted' },
				'deleted'
			);
		} else if (status === 'AD') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-deleted' },
				'deleted'
			);
		} else if (status === 'DD') {
			statusLabel = [React.createElement(
				'span',
				{ className: 'git-status-deleted-staged' },
				'del'
			), React.createElement(
				'span',
				{ className: 'git-status-deleted' },
				'eted'
			)];
		} else if (status === 'A ') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-new-file-staged' },
				'new file'
			);
		} else if (status === ' A') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-new-file-staged' },
				'new file'
			);
		} else if (status === 'AM') {
			statusLabel = React.createElement(
				'span',
				{ className: 'git-status-new-file-staged' },
				'new file'
			);
		} else {
			statusLabel = status;
		}

		return React.createElement(
			'div',
			{
				className: finalClassName,
				'aria-role': 'button',
				onClick: function onClick() {
					return accept(item);
				}
			},
			React.createElement(
				'span',
				{ className: 'git-status' },
				statusLabel
			),
			React.createElement('span', { dangerouslySetInnerHTML: { __html: wrappedValue } })
		);
	};
});

var gitFiles = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$3(dependencies);

	var loadData = loadDataFactory$2({ hideDeletedFiles: true });

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
		renderer: renderer,
		columns: 4,
		sliceLength: 20,
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

	return function () {
		// cmdProcess.stdin.pause()
		cmdProcess.kill();
	};
});

var gitBranches = (function (_ref) {
	var store = _ref.store;

	var accept = function accept(branch) {
		var value = branch.value.trim();

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
		sliceLength: 9,
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

	return function () {
		// cmdProcess.stdin.pause()
		cmdProcess.kill();
	};
});

var gitLog = (function (_ref) {
	var store = _ref.store;

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
		columns: 1,
		sliceLength: 10,
		description: 'git log - Copy git commit hash to clipboard',
		id: 'sparkling-git-log'
	};
});

var gitLogCheckout = (function (_ref) {
	var store = _ref.store;

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
		sliceLength: 10,
		columns: 1,
		description: 'git log - Checkout git commit',
		id: 'sparkling-git-commit'
	};
});

var gitStage = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$3(dependencies);

	var loadData = loadDataFactory$2({ hideDeletedFiles: false });

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
		renderer: renderer,
		columns: 3,
		description: 'Stage and unstage git files',
		id: 'sparkling-git-stage'
	};
});

var gitCheckout = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$3(dependencies);

	var loadData = loadDataFactory$2();

	var accept = function accept(item) {
		var cmdProcess = spawnInProject('git', ['checkout', '--', item.path]);

		cmdProcess.on('exit', function () {
			store.dispatch({
				type: 'REMOVE_ITEM',
				payload: { item: item }
			});
		});
	};

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		sliceLength: 9,
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

	return function () {
		// cmdProcess.stdin.pause()
		cmdProcess.kill();
	};
});

var gitReflog = (function (_ref) {
	var store = _ref.store;

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

var gitReflogCheckout = (function (_ref) {
	var store = _ref.store;

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
		columns: 1,
		sliceLength: 10,
		description: 'git reflog - Checkout git commit',
		id: 'sparkling-git-reflog'
	};
});

var lines = (function (dependencies) {
	var store = dependencies.store,
	    React = dependencies.React,
	    fromSelector = dependencies.fromSelector,
	    withSideEffect = dependencies.components.withSideEffect;


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

		return function () {};
	};

	var onLine = function onLine(line) {
		if (!line) {
			return;
		}

		var editor = atom.workspace.getActiveTextEditor();
		editor.setCursorBufferPosition([line.lineNumber, 0]);
		editor.moveToFirstCharacterOfLine();
		editor.selectToEndOfLine();
	};

	var accept = function accept(line) {
		onLine(line);
		store.dispatch({ type: 'HIDE' });
	};

	var LineSideEffect = withSideEffect(fromSelector(getSelectedValue))(onLine)(function () {
		return null;
	});

	return {
		loadData: loadData,
		accept: accept,
		childrenRenderer: function childrenRenderer() {
			return React.createElement(LineSideEffect, null);
		},
		description: 'Find lines in current buffer',
		id: 'sparkling-buffer-lines',
		sliceLength: 10
	};
});

var loadDataFactory$3 = (function (store) {
	return function (onData) {
		var state = store.getState();
		var find = getFind(state);
		var smartCase = isSmartCase(state);
		var scope = getScope(state);
		var literalSearch = isLiteralSearch(state);
		var wholeWord = isWholeWord(state);

		var cmdProcess = spawnInProject('ag', [find, '--ackmate'].concat(toConsumableArray(scope === '' ? [] : ['-G', scope]), toConsumableArray(smartCase ? ['--smart-case'] : []), toConsumableArray(literalSearch ? ['--literal'] : []), toConsumableArray(wholeWord ? ['--word-regexp'] : [])));

		cmdProcess.stdout.on('data', function (data) {
			var lines = data.toString('utf-8').split('\n');
			onData(ackmateParser(lines));
		});

		return function () {
			// cmdProcess.stdin.pause()
			cmdProcess.kill();
		};
	};
});

var rendererFactory$4 = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    single = _ref.single,
	    iconClassForPath = _ref.utils.iconClassForPath;
	return function (_ref2) {
		var item = _ref2.item,
		    pattern = _ref2.pattern,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex,
		    accept = _ref2.accept;
		var startColumn = item.startColumn,
		    endColumn = item.endColumn,
		    value = item.value,
		    path$$1 = item.path;


		var match = single(pattern, value);
		var indexes = match ? match.indexes : [];

		var lines = value.split('').map(function (c, index) {
			if (c === '\t') {
				c = React.createElement('span', {
					style: {
						display: 'inline-block',
						width: '20px'
					}
				});
			} else if (c === ' ') {
				c = React.createElement('span', {
					style: {
						display: 'inline-block',
						width: '10px'
					}
				});
			}

			if (indexes.includes(index)) {
				return React.createElement(
					'span',
					{ className: 'highlight' },
					c
				);
			}

			return c;
		}).reduce(function (lines, character) {
			if (character === '\n') {
				lines.push([]);
			} else {
				lines[lines.length - 1].push(character);
			}

			return lines;
		}, [[]]).map(function (line, index, lines) {
			if (index === 0 && lines.length === 1) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						line.slice(0, startColumn)
					),
					React.createElement(
						'span',
						{ className: 'find-highlight' },
						line.slice(startColumn, endColumn)
					),
					React.createElement(
						'span',
						null,
						line.slice(endColumn)
					)
				);
			} else if (index === 0) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						line.slice(0, startColumn)
					),
					React.createElement(
						'span',
						{ className: 'find-highlight' },
						line.slice(startColumn)
					)
				);
			} else if (index === lines.length - 1) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						{ className: 'find-highlight' },
						line.slice(0, endColumn)
					),
					React.createElement(
						'span',
						null,
						line.slice(endColumn)
					)
				);
			}

			return React.createElement(
				'div',
				{ className: 'find-highlight' },
				line
			);
		});

		var finalClassName = classnames('sparkling-row', 'sparkling-row__find', defineProperty({}, 'sparkling-row--selected', index === selectedIndex));

		return React.createElement(
			'div',
			{
				className: finalClassName,
				'aria-role': 'button',
				onClick: function onClick() {
					return accept(item);
				} },
			React.createElement(
				'span',
				{ className: classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1)))) },
				path$$1
			),
			lines
		);
	};
});

// import fs from 'fs'
var find = (function (dependencies) {
	var React = dependencies.React,
	    store = dependencies.store,
	    fromSelector = dependencies.fromSelector,
	    withSideEffect = dependencies.components.withSideEffect;


	var renderer = rendererFactory$4(dependencies);

	var loadData = loadDataFactory$3(store);

	var accept = function accept(result) {
		var startLine = result.startLine,
		    startColumn = result.startColumn,
		    endLine = result.endLine,
		    endColumn = result.endColumn,
		    path$$1 = result.path;
		// const scope = getScope(store.getState())
		// const cwd = atom.project.getPaths()[0]
		// const absolutePath = nodePath.resolve(cwd, `.${scope}`)

		// if (result && scope !== '' && fs.lstatSync(absolutePath).isFile()) {
		// 	store.dispatch({ type: 'HIDE' })
		// }

		atom.workspace.open(path$$1).then(function (editor) {
			editor.setSelectedBufferRange([[startLine - 1, startColumn], [endLine - 1, endColumn]]);
		});
	};

	var FindSideEffect = withSideEffect(fromSelector(getSelectedValue))(function (result) {
		if (!result) {
			return;
		}

		var startLine = result.startLine,
		    startColumn = result.startColumn,
		    endLine = result.endLine,
		    endColumn = result.endColumn,
		    path$$1 = result.path;


		var editor = atom.workspace.getActiveTextEditor();

		var cwd = atom.project.getPaths()[0];
		var absolutePath = path.resolve(cwd, './' + path$$1);

		if (absolutePath !== editor.getPath()) {
			return;
		}

		editor.setSelectedBufferRange([[startLine - 1, startColumn], [endLine - 1, endColumn]]);
	})(function () {
		return null;
	});

	return {
		loadData: loadData,
		accept: accept,
		renderer: renderer,
		description: 'Find pattern in project',
		id: 'sparkling-project-find',
		sliceLength: 10,
		columns: 1,
		childrenRenderer: function childrenRenderer() {
			return React.createElement(FindSideEffect, null);
		}
	};
});

var rendererFactory$5 = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    single = _ref.single,
	    connect = _ref.connect,
	    iconClassForPath = _ref.utils.iconClassForPath;

	var Replace = function Replace(_ref2) {
		var item = _ref2.item,
		    pattern = _ref2.pattern,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex,
		    accept = _ref2.accept,
		    replace = _ref2.replace;
		var startColumn = item.startColumn,
		    endColumn = item.endColumn,
		    value = item.value,
		    path$$1 = item.path;


		var match = single(pattern, value);
		var indexes = match ? match.indexes : [];

		var lines = value.split('').map(function (c, index) {
			if (c === '\t') {
				c = React.createElement('span', {
					style: {
						display: 'inline-block',
						width: '20px'
					}
				});
			} else if (c === ' ') {
				c = React.createElement('span', {
					style: {
						display: 'inline-block',
						width: '10px'
					}
				});
			}

			if (indexes.includes(index)) {
				return React.createElement(
					'span',
					{ className: 'highlight' },
					c
				);
			}

			return c;
		}).reduce(function (lines, character) {
			if (character === '\n') {
				lines.push([]);
			} else {
				lines[lines.length - 1].push(character);
			}

			return lines;
		}, [[]]).map(function (line, index, lines) {
			if (index === 0 && lines.length === 1) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						line.slice(0, startColumn)
					),
					React.createElement(
						'span',
						{ className: 'replace-downlight' },
						line.slice(startColumn, endColumn)
					),
					React.createElement(
						'span',
						{ className: 'replace-highlight' },
						replace
					),
					React.createElement(
						'span',
						null,
						line.slice(endColumn)
					)
				);
			} else if (index === 0) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						null,
						line.slice(0, startColumn)
					),
					React.createElement(
						'span',
						{ className: 'replace-downlight' },
						line.slice(startColumn)
					)
				);
			} else if (index === lines.length - 1) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'span',
						{ className: 'replace-downlight' },
						line.slice(0, endColumn)
					),
					React.createElement(
						'span',
						{ className: 'replace-highlight' },
						replace
					),
					React.createElement(
						'span',
						null,
						line.slice(endColumn)
					)
				);
			}

			return React.createElement(
				'div',
				{ className: 'replace-downlight' },
				line
			);
		});

		var finalClassName = classnames('sparkling-row', 'sparkling-row__find', defineProperty({}, 'sparkling-row--selected', index === selectedIndex));

		return React.createElement(
			'div',
			{
				className: finalClassName,
				'aria-role': 'button',
				onClick: function onClick() {
					return accept(item);
				} },
			React.createElement(
				'span',
				{ className: classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1)))) },
				path$$1
			),
			lines
		);
	};

	var ReplaceWithConnect = connect(function (state) {
		return {
			replace: getReplace(state)
		};
	})(Replace);

	return function (props) {
		return React.createElement(ReplaceWithConnect, props);
	};
});

var replace = (function (dependencies) {
	var React = dependencies.React,
	    store = dependencies.store,
	    components = dependencies.components,
	    connect = dependencies.connect;
	var Input = components.Input;


	var ReplaceInput = function ReplaceInput(_ref) {
		var value = _ref.value,
		    setValue = _ref.setValue;
		return React.createElement(Input, {
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

	var renderer = rendererFactory$5(dependencies);

	var loadData = loadDataFactory$3(store);

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
		renderer: renderer,
		description: 'Replace pattern in project',
		id: 'sparkling-project-replace',
		sliceLength: 10,
		childrenRenderer: function childrenRenderer() {
			return React.createElement(ReplaceInputContainer, null);
		}
	};
});

var loadData$4 = (function (onData) {
	var cmdProcess = spawnInProject('rg', ['^.*$', '-n', '--max-filesize', '100K', '--glob', '!.git/*']);

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

var allLines = (function (_ref) {
	var store = _ref.store;

	var accept = function accept(line) {
		store.dispatch({ type: 'HIDE' });
		atom.workspace.open(line.path, {
			initialLine: line.lineNumber - 1
		});
	};

	return {
		loadData: loadData$4,
		accept: accept,
		columns: 1,
		sliceLength: 10,
		description: 'Find lines in project',
		id: 'sparkling-project-lines'
	};
});

var autocompleteLines = (function (_ref) {
	var store = _ref.store;

	var accept = function accept(item) {
		store.dispatch({ type: 'HIDE' });
		var editor = atom.workspace.getActiveTextEditor();
		editor.insertText(item.line);
	};

	return {
		loadData: loadData$4,
		accept: accept,
		columns: 1,
		sliceLength: 10,
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	};
});

var render = (function (root, dependencies) {
	var _require = require('react-dom'),
	    render = _require.render;

	var React = dependencies.React,
	    store = dependencies.store,
	    Provider = dependencies.Provider,
	    components = dependencies.components;
	var Sparkling = components.Sparkling,
	    FindContainer = components.FindContainer,
	    ExtraInputContainer = components.ExtraInputContainer;


	render(React.createElement(
		Provider,
		{ store: store },
		React.createElement(
			'div',
			null,
			React.createElement(Sparkling, null),
			React.createElement(FindContainer, null),
			React.createElement(ExtraInputContainer, null)
		)
	), root);
});

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

var react_1 = react.cloneElement;
var react_2 = react.createElement;
var react_3 = react.PropTypes;
var react_4 = react.Children;
var react_5 = react.Component;

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

var root = {
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

var Subscription = (function () {
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
var Subscription_2 = Subscription;
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
var Symbol = root.root.Symbol;
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
exports.observable = getSymbolObservable(root.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map
});

var observable_1 = observable.getSymbolObservable;
var observable_2 = observable.observable;
var observable_3 = observable.$$observable;

function noop() { }
var noop_2 = noop;
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
            if (root.root.Rx && root.root.Rx.config && root.root.Rx.config.Promise) {
                PromiseCtor = root.root.Rx.config.Promise;
            }
            else if (root.root.Promise) {
                PromiseCtor = root.root.Promise;
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
            if (root.root.Rx && root.root.Rx.config && root.root.Rx.config.Promise) {
                PromiseCtor = root.root.Rx.config.Promise;
            }
            else if (root.root.Promise) {
                PromiseCtor = root.root.Promise;
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
function symbolIteratorPonyfill(root$$1) {
    var Symbol = root$$1.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root$$1.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root$$1.Map;
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
exports.iterator = symbolIteratorPonyfill(root.root);
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
            root.root.setTimeout(function () { throw err; });
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
        return root.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // or the action has been rescheduled before it's executed, clear the interval id
        return root.root.clearInterval(id) && undefined || undefined;
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
 * Emits a value from the source Observable only after a particular time span
 * has passed without another source emission.
 *
 * <span class="informal">It's like {@link delay}, but passes only the most
 * recent value from each burst of emissions.</span>
 *
 * <img src="./img/debounceTime.png" width="100%">
 *
 * `debounceTime` delays values emitted by the source Observable, but drops
 * previous pending delayed emissions if a new value arrives on the source
 * Observable. This operator keeps track of the most recent value from the
 * source Observable, and emits that only when `dueTime` enough time has passed
 * without any other value appearing on the source Observable. If a new value
 * appears before `dueTime` silence occurs, the previous value will be dropped
 * and will not be emitted on the output Observable.
 *
 * This is a rate-limiting operator, because it is impossible for more than one
 * value to be emitted in any time window of duration `dueTime`, but it is also
 * a delay-like operator since output emissions do not occur at the same time as
 * they did on the source Observable. Optionally takes a {@link IScheduler} for
 * managing timers.
 *
 * @example <caption>Emit the most recent click after a burst of clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var result = clicks.debounceTime(1000);
 * result.subscribe(x => console.log(x));
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} dueTime The timeout duration in milliseconds (or the time
 * unit determined internally by the optional `scheduler`) for the window of
 * time required to wait for emission silence before emitting the most recent
 * source value.
 * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
 * managing the timers that handle the timeout for each value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified `dueTime`, and may drop some values if they occur
 * too frequently.
 * @method debounceTime
 * @owner Observable
 */
function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) { scheduler = async.async; }
    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
}
var debounceTime_2 = debounceTime;
var DebounceTimeOperator = (function () {
    function DebounceTimeOperator(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    DebounceTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    };
    return DebounceTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DebounceTimeSubscriber = (function (_super) {
    __extends$14(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
        _super.call(this, destination);
        this.dueTime = dueTime;
        this.scheduler = scheduler;
        this.debouncedSubscription = null;
        this.lastValue = null;
        this.hasValue = false;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
        this.debouncedNext();
        this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
        this.clearDebounce();
        if (this.hasValue) {
            this.destination.next(this.lastValue);
            this.lastValue = null;
            this.hasValue = false;
        }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
        var debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    };
    return DebounceTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}
//# sourceMappingURL=debounceTime.js.map

var debounceTime_1 = {
	debounceTime: debounceTime_2
};

function debounceTime$1(dueTime, scheduler) {
    if (scheduler === void 0) { scheduler = async.async; }
    return debounceTime_1.debounceTime(dueTime, scheduler)(this);
}
var debounceTime_3 = debounceTime$1;
//# sourceMappingURL=debounceTime.js.map

var debounceTime_2$1 = {
	debounceTime: debounceTime_3
};

Observable_1.Observable.prototype.debounceTime = debounceTime_2$1.debounceTime;
//# sourceMappingURL=debounceTime.js.map

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

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal || freeSelf || Function('return this')();

var Symbol$1 = root$2.Symbol;

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
var root$4;

if (typeof self !== 'undefined') {
  root$4 = self;
} else if (typeof window !== 'undefined') {
  root$4 = window;
} else if (typeof global !== 'undefined') {
  root$4 = global;
} else if (typeof module !== 'undefined') {
  root$4 = module;
} else {
  root$4 = Function('return this')();
}

var result = symbolObservablePonyfill(root$4);

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
        warning$3('No reducer provided for key "' + key + '"');
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
        warning$3(warningMessage);
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
  warning$3('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  warning$4('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
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
      return react_4.only(this.props.children);
    };

    return Provider;
  }(react_5);

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

var Subscription$1 = function () {
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

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var hotReloadingVersion = 0;
var dummyState = {};
function noop$1() {}
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

    var selectorFactoryOptions = _extends$2({}, connectOptions, {
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
        this.notifyNestedSubs = noop$1;
        this.store = null;
        this.selector.run = noop$1;
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
        this.subscription = new Subscription$1(this.store, parentSub, this.onStateChange.bind(this));

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
        var withExtras = _extends$2({}, props);
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
          return react_2(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(react_5);

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

function verifyPlainObject(value, displayName, methodName) {
  if (!isPlainObject(value)) {
    warning$4(methodName + '() in ' + displayName + ' must return a plain object. Instead received ' + value + '.');
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
      warning$4('The selector for ' + methodName + ' of ' + displayName + ' did not specify a value for dependsOnOwnProps.');
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

var DEFAULT_SLICE_LENGTH = 12;

var commandFactoryFactory = (function (dependencies) {
	return function (optionsFactory) {
		var store = dependencies.store;


		var defaultRenderer = defaultRendererFactory(dependencies);

		var defaults$$1 = {
			preview: null,
			sliceLength: DEFAULT_SLICE_LENGTH,
			columns: 1,
			renderer: defaultRenderer
		};

		var partialOptions = optionsFactory(dependencies);
		var options = _extends({}, defaults$$1, partialOptions);

		var command = function command(extraOptions) {
			var finalOptions = _extends({}, options, extraOptions);
			store.dispatch({
				type: 'SHOW',
				payload: finalOptions
			});

			var sparklingInput = document.getElementById('sparkling-input');
			sparklingInput && sparklingInput.focus();
		};

		return command;
	};
});

var utilsFactory = (function (_ref) {
	var fileIconsService = _ref.fileIconsService;
	return {
		iconClassForPath: function iconClassForPath(path$$1) {
			return fileIconsService ? fileIconsService.iconClassForPath(path$$1) : [''];
		}
	};
});

var InputFactory = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames;

	return function (_React$PureComponent) {
		inherits(Input, _React$PureComponent);

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


				return React.createElement('input', {
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
	}(React.PureComponent);
});

var SparklingInputFactory = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    connect = _ref.connect,
	    components = _ref.components;
	var Input = components.Input;


	var SparklingInput = function SparklingInput(_ref2) {
		var options = _ref2.options,
		    data = _ref2.data,
		    rawDataLength = _ref2.rawDataLength,
		    pattern = _ref2.pattern,
		    setPattern = _ref2.setPattern,
		    selectedValue = _ref2.selectedValue;
		var description = options.description,
		    childrenRenderer = options.childrenRenderer;

		var filteredDataLength = data.length;
		var value = selectedValue ? selectedValue.value : '';

		return React.createElement(
			'div',
			{ className: 'sparkling-input-container' },
			React.createElement(
				'div',
				{ className: 'sparkling-meta-data' },
				React.createElement(
					'span',
					null,
					filteredDataLength + ' / ' + rawDataLength
				),
				React.createElement(
					'span',
					{ className: 'sparkling-command-description' },
					description + ' - ' + value
				)
			),
			React.createElement(Input, {
				autoFocus: true,
				id: 'sparkling-input',
				tabIndex: 1,
				className: classnames('sparkling-input', 'native-key-bindings', {
					'sparkling-input--has-results': filteredDataLength > 0,
					'sparkling-input--no-results': rawDataLength && !filteredDataLength
				}),
				placeholder: 'Sparkling fuzzy filter',
				value: pattern,
				setValue: setPattern
			}),
			childrenRenderer && childrenRenderer()
		);
	};

	return connect(function (state) {
		return {
			data: getSparklingData(state),
			options: getOptions(state),
			rawDataLength: getRawDataLength(state),
			pattern: getPattern(state),
			selectedValue: getSelectedValue(state)
		};
	}, function (dispatch) {
		return {
			setPattern: function setPattern(pattern) {
				return dispatch({ type: 'SET_PATTERN', payload: { pattern: pattern } });
			}
		};
	})(SparklingInput);
});

var SparklingResultsFactory = (function (_ref) {
	var React = _ref.React,
	    connect = _ref.connect;

	var SparklingResults = function SparklingResults(_ref2) {
		var options = _ref2.options,
		    selectedValue = _ref2.selectedValue,
		    data = _ref2.data,
		    selectedIndex = _ref2.selectedIndex,
		    offset = _ref2.offset,
		    pattern = _ref2.pattern;
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

		return React.createElement(
			'div',
			{ className: 'sparkling-results-container' },
			React.createElement(
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
			preview && selectedValue && React.createElement(
				'div',
				{ className: 'sparkling-preview' },
				preview(selectedValue)
			)
		);
	};

	return connect(function (state) {
		return {
			options: getOptions(state),
			data: getSparklingData(state),
			selectedIndex: getIndex(state),
			selectedValue: getSelectedValue(state),
			offset: getOffset(state),
			pattern: getPattern(state)
		};
	})(SparklingResults);
});

var SparklingFactory = (function (dependencies) {
	var React = dependencies.React;


	var SparklingInput = SparklingInputFactory(dependencies);
	var SparklingResults = SparklingResultsFactory(dependencies);

	return function (_ref) {
		var options = _ref.options;
		var id = options.id;


		return React.createElement(
			'div',
			{ className: 'sparkling', id: id },
			React.createElement(SparklingResults, null),
			React.createElement(SparklingInput, null)
		);
	};
});

var SparklingContainer = (function (dependencies) {
	var React = dependencies.React,
	    connect = dependencies.connect;


	var Sparkling = SparklingFactory(dependencies);

	var SparklingContainer = function SparklingContainer(_ref) {
		var visible = _ref.visible,
		    options = _ref.options;

		if (!visible) {
			return null;
		}

		return React.createElement(Sparkling, { options: options });
	};

	var mapStateToProps = function mapStateToProps(state) {
		return {
			visible: isVisible(state),
			options: getOptions(state)
		};
	};

	return connect(mapStateToProps)(SparklingContainer);
});

var FindContainerFactory = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    connect = _ref.connect,
	    components = _ref.components;
	var Input = components.Input;

	var FindContainer = function FindContainer(_ref2) {
		var visible = _ref2.visible,
		    value = _ref2.value,
		    setValue = _ref2.setValue,
		    toggleSmartCase = _ref2.toggleSmartCase,
		    smartCase = _ref2.smartCase,
		    scope = _ref2.scope,
		    setScope = _ref2.setScope,
		    toggleLiteralSearch = _ref2.toggleLiteralSearch,
		    literalSearch = _ref2.literalSearch;

		if (!visible) {
			return null;
		}

		return React.createElement(
			"div",
			{ className: "sparkling-input-container" },
			React.createElement(
				"div",
				{ className: "sparkling-find-options" },
				React.createElement(
					"button",
					{
						onClick: toggleSmartCase,
						className: classnames('sparkling-toggle', defineProperty({}, 'sparkling-toggle-active', smartCase))
					},
					"Smart case"
				),
				React.createElement(
					"button",
					{
						onClick: toggleLiteralSearch,
						className: classnames('sparkling-toggle', defineProperty({}, 'sparkling-toggle-active', literalSearch))
					},
					"Literal search"
				)
			),
			React.createElement(Input, {
				tabIndex: 0,
				className: "sparkling-find",
				autoFocus: true,
				value: value,
				setValue: setValue,
				placeholder: "Enter to find, shift Enter to replace"
			}),
			React.createElement(Input, {
				tabIndex: 1,
				className: "sparkling-scope",
				value: scope,
				setValue: setScope,
				placeholder: "Scope. Leave empty to search whole project"
			})
		);
	};

	return connect(function (state) {
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
});

// @lflow

var ExtraInputContainerFactory = (function (_ref) {
	var React = _ref.React,
	    connect = _ref.connect,
	    components = _ref.components;
	var Input = components.Input;


	var ExtraInputContainer = function ExtraInputContainer(_ref2) {
		var extraInput = _ref2.extraInput,
		    setValue = _ref2.setValue;
		var value = extraInput.value,
		    id = extraInput.id,
		    _extraInput$placehold = extraInput.placeholder,
		    placeholder = _extraInput$placehold === undefined ? '' : _extraInput$placehold;

		if (!id) {
			return null;
		}

		return React.createElement(
			'div',
			{ id: id, className: 'sparkling-input-container' },
			React.createElement(Input, {
				autoFocus: true,
				value: value,
				setValue: setValue,
				placeholder: placeholder
			})
		);
	};

	return connect(function (state) {
		return {
			extraInput: getExtraInput(state)
		};
	}, function (dispatch) {
		return {
			setValue: function setValue(value) {
				return dispatch({ type: 'SET_EXTRA_INPUT', payload: { value: value } });
			}
		};
	})(ExtraInputContainer);
});

var componentsFactory = (function (dependencies) {
	var React = dependencies.React;


	var withSideEffect = function withSideEffect(observable) {
		return function (onValue) {
			return function (BaseComponent) {
				return function (_React$PureComponent) {
					inherits(SideEffect, _React$PureComponent);

					function SideEffect() {
						classCallCheck(this, SideEffect);

						var _this = possibleConstructorReturn(this, (SideEffect.__proto__ || Object.getPrototypeOf(SideEffect)).call(this));

						_this.subscription = null;
						return _this;
					}

					createClass(SideEffect, [{
						key: 'componentDidMount',
						value: function componentDidMount() {
							this.subscription = observable.subscribe(onValue);
						}
					}, {
						key: 'componentWillUnmount',
						value: function componentWillUnmount() {
							this.subscription.unsubscribe();
						}
					}, {
						key: 'render',
						value: function render() {
							return React.createElement(BaseComponent, this.props);
						}
					}]);
					return SideEffect;
				}(React.PureComponent);
			};
		};
	};

	var Input = InputFactory(dependencies);
	dependencies.components = { Input: Input };

	var Sparkling = SparklingContainer(dependencies);
	var FindContainer = FindContainerFactory(dependencies);
	var ExtraInputContainer = ExtraInputContainerFactory(dependencies);

	return {
		Input: Input,
		Sparkling: Sparkling,
		FindContainer: FindContainer,
		ExtraInputContainer: ExtraInputContainer,
		withSideEffect: withSideEffect
	};
});

var reducerCreator = function reducerCreator(reducers) {
	return function (initialState) {
		return function () {
			var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
			var action = arguments[1];

			var reducer = reducers[action.type];

			if (reducer !== null && reducer !== undefined) {
				return typeof reducer === 'function' ? reducer(state, action) : reducer;
			}

			return state;
		};
	};
};

var returnPayload = function returnPayload(field) {
	return function (state, _ref) {
		var payload = _ref.payload;
		return payload[field];
	};
};

var visible = reducerCreator({
	SHOW: true,
	HIDE: false,
	SHOW_SEARCH: false,
	SHOW_EXTRA_INPUT: false
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
	SHOW: function SHOW(state, _ref2) {
		var payload = _ref2.payload;
		return payload;
	}
})({
	loadData: function loadData() {
		return function () {};
	},
	accept: function accept() {},
	renderer: function renderer() {},
	sliceLength: 20,
	columns: 4,
	description: '',
	id: ''
});

var data = reducerCreator({
	APPEND_DATA: function APPEND_DATA(state, _ref3) {
		var data = _ref3.payload.data;
		return state.concat(data);
	},
	SHOW: [],
	HIDE: [],
	SHOW_SEARCH: [],
	RELOAD: [],
	REMOVE_ITEM: function REMOVE_ITEM(state, _ref4) {
		var item = _ref4.payload.item;
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
	REMOVE_ITEM: function REMOVE_ITEM(state, _ref5) {
		var item = _ref5.payload.item;
		return state.filter(function (x) {
			return x !== item;
		});
	}
})([]);

var pattern = reducerCreator({
	SET_PATTERN: function SET_PATTERN(state, _ref6) {
		var pattern = _ref6.payload.pattern;
		return _extends({}, state, {
			value: pattern
		});
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
	SHOW_EXTRA_INPUT: function SHOW_EXTRA_INPUT(state, _ref7) {
		var payload = _ref7.payload;
		return _extends({}, state, payload);
	},
	SET_EXTRA_INPUT: function SET_EXTRA_INPUT(state, _ref8) {
		var payload = _ref8.payload;
		return _extends({}, state, payload);
	},
	HIDE: {}
})({});

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

var reducers = {
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
};

var fromSelectorFactory = function fromSelectorFactory(_ref) {
	var store = _ref.store,
	    Observable = _ref.Observable;
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

var fromActionFactory = function fromActionFactory(_ref2) {
	var store = _ref2.store,
	    Observable = _ref2.Observable;

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
						observer.next();
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

function storeFactory(_ref3) {
	var Observable = _ref3.Observable,
	    createStore = _ref3.createStore,
	    combineReducers = _ref3.combineReducers;

	var reducers$$1 = combineReducers(reducers);
	var store = createStore(reducers$$1);
	var fromAction = fromActionFactory({ store: store, Observable: Observable });
	var fromSelector = fromSelectorFactory({ store: store, Observable: Observable });
	// store.subscribe(() => {
	// 	console.log(store.getState())
	// })

	return { store: store, fromAction: fromAction, fromSelector: fromSelector };
}

var observablesFactory = (function (_ref) {
	var store = _ref.store,
	    fromSelector = _ref.fromSelector,
	    fromAction = _ref.fromAction,
	    Observable = _ref.Observable,
	    filter = _ref.filter;

	var cancelLoadData = null;

	Observable.combineLatest(fromSelector(getData), fromSelector(getPattern)).auditTime(100).subscribe(function (_ref2) {
		var _ref3 = slicedToArray(_ref2, 2),
		    data = _ref3[0],
		    pattern = _ref3[1];

		if (!pattern.length && (!data || !data.length)) {
			return;
		}

		if (!pattern.length) {
			store.dispatch({
				type: 'SET_FILTERED_DATA',
				payload: { data: data }
			});
		} else {
			filter(pattern, data).then(function (filteredData) {
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

var wrapFactory = function wrapFactory(_ref) {
	var fuzzysort = _ref.fuzzysort;

	return function (str) {
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
};

var fuzzyFilterFactory = (function (_ref2) {
	var fuzzysort = _ref2.fuzzysort;

	var promise = null;

	var wrap = wrapFactory({ fuzzysort: fuzzysort });

	var filter = function filter(pattern, data) {
		promise && promise.cancel();
		promise = fuzzysort.goAsync(pattern, data, { key: 'value' });
		return promise.then(function (filteredData) {
			return filteredData.map(function (x) {
				return x.obj;
			});
		});
	};

	var single = fuzzysort.single;


	return { wrap: wrap, filter: filter, single: single };
});

var dependenciesFactory = (function (_ref) {
	var fileIconsService = _ref.fileIconsService;

	var dependencies = {
		fileIconsService: fileIconsService,
		React: react,
		classnames: classnames,
		Observable: Observable_2,
		createStore: createStore,
		combineReducers: combineReducers
	};

	var utils = utilsFactory(dependencies);
	dependencies.utils = utils;

	var _fuzzyFilterFactory = fuzzyFilterFactory({ fuzzysort: fuzzysort }),
	    filter = _fuzzyFilterFactory.filter,
	    wrap = _fuzzyFilterFactory.wrap,
	    single = _fuzzyFilterFactory.single;

	dependencies.filter = filter;
	dependencies.wrap = wrap;
	dependencies.single = single;

	var _storeFactory = storeFactory(dependencies),
	    store = _storeFactory.store,
	    fromAction = _storeFactory.fromAction,
	    fromSelector = _storeFactory.fromSelector;

	dependencies.store = store;
	dependencies.fromAction = fromAction;
	dependencies.fromSelector = fromSelector;

	observablesFactory(dependencies);
	dependencies.Provider = Provider;
	dependencies.connect = connect;

	var components = componentsFactory(dependencies);
	dependencies.components = components;

	var commandFactory = commandFactoryFactory(dependencies);
	dependencies.commandFactory = commandFactory;

	return dependencies;
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
			var _value = Math.min(offset + 1, sparklingData.length - sliceLength);
			dispatch({ type: 'SET_OFFSET', payload: { value: _value } });
		} else {
			var _value2 = Math.min(index + 1, sparklingData.length - 1, sliceLength - 1);
			dispatch({ type: 'SET_INDEX', payload: { value: _value2 } });
		}
	};
};

var previous = function previous() {
	return function (dispatch, getState) {
		var state = getState();
		var index = getIndex(state);

		if (index === 0) {
			var offset = getOffset(state);
			var _value3 = Math.max(offset - 1, 0);
			dispatch({ type: 'SET_OFFSET', payload: { value: _value3 } });
		} else {
			var _value4 = Math.max(index - 1, 0);
			dispatch({ type: 'SET_INDEX', payload: { value: _value4 } });
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
			var _value5 = Math.max(offset - rows, 0);
			dispatch({ type: 'SET_OFFSET', payload: { value: _value5 } });
		} else {
			var _value6 = Math.max(index - rows, 0);
			dispatch({ type: 'SET_INDEX', payload: { value: _value6 } });
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
			var _value7 = Math.min(offset + rows, sparklingData.length - sliceLength);
			dispatch({ type: 'SET_OFFSET', payload: { value: _value7 } });
		} else {
			var _value8 = Math.min(index + rows, sparklingData.length - 1, sliceLength - 1);
			dispatch({ type: 'SET_INDEX', payload: { value: _value8 } });
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
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { find: '', scope: '' },
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

var togglePattern = function togglePattern(_ref2) {
	var pattern = _ref2.pattern;
	return function (dispatch, getState) {
		var currentPattern = getPattern(getState());
		dispatch({
			type: 'SET_PATTERN',
			payload: { pattern: currentPattern === pattern ? '' : pattern }
		});
	};
};

var entry = (function (_ref) {
	var subscriptions = _ref.subscriptions,
	    fileIconsService = _ref.fileIconsService;

	var dependencies = dependenciesFactory({ fileIconsService: fileIconsService });

	var store = dependencies.store,
	    fromAction = dependencies.fromAction,
	    commandFactory = dependencies.commandFactory;


	var rxjsSubscription = fromAction('HIDE').subscribe(function () {
		var editor = atom.workspace.getActiveTextEditor();
		var view = editor && atom.views.getView(editor);
		view && view.focus();
	});

	subscriptions.add({
		dispose: function dispose() {
			return rxjsSubscription.unsubscribe();
		}
	});

	var reactRoot = document.createElement('div');

	render(reactRoot, dependencies);

	atom.workspace.addBottomPanel({ item: reactRoot, model: {} });

	var onDone = function onDone(extraInput) {
		store.dispatch({ type: 'HIDE' });
		atom.workspace.open(extraInput.value);
	};

	var add = function add(name, commandFactoryOptions) {
		var command = commandFactory(commandFactoryOptions);
		subscriptions.add(atom.commands.add('atom-workspace', defineProperty({}, 'sparkling:' + name, command)));
	};

	add('files', files);
	add('tokens', tokens);
	add('emoji', emoji);
	add('relativePathInsert', relativePathInsert);
	add('relativePathCopy', relativePathCopy);
	add('gitFiles', gitFiles);
	add('gitStage', gitStage);
	add('gitBranches', gitBranches);
	add('gitLog', gitLog);
	add('gitLogCheckout', gitLogCheckout);
	add('gitCheckout', gitCheckout);
	add('gitReflog', gitReflog);
	add('gitReflogCheckout', gitReflogCheckout);
	add('lines', lines);
	add('allLines', allLines);
	add('autocompleteLines', autocompleteLines);
	add('find', find);
	add('replace', replace);
	add('removeFiles', removeFiles);
	add('moveFiles', moveFiles);
	add('copyFiles', copyFiles);

	var lsCommand = commandFactory(ls);
	var commandsCommand = commandFactory(commands);

	subscriptions.add(atom.commands.add('atom-workspace', {
		'sparkling:toggleSelfFind': function sparklingToggleSelfFind() {
			var editor = atom.workspace.getActiveTextEditor();
			var cwd = atom.project.getPaths()[0];
			var self = editor ? editor.getPath() : atom.project.getPaths()[0];

			var pattern = cwd === self ? cwd : self.replace(cwd, '');

			if (pattern[0] === '/') {
				pattern = pattern.slice(1);
			}

			store.dispatch(togglePattern({ pattern: pattern }));
		},
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
		'sparkling:commands': function sparklingCommands() {
			commandsCommand({ activeElement: document.activeElement });
		},
		'sparkling:ls': function sparklingLs() {
			var activeTextEditor = atom.workspace.getActiveTextEditor();
			var finalPath = activeTextEditor ? path.dirname(activeTextEditor.getPath()) : atom.project.getPaths()[0];

			lsCommand({ path: finalPath, description: finalPath, lsCommand: lsCommand });
		},
		'sparkling:lsUp': function sparklingLsUp() {
			var _getOptions = getOptions(store.getState()),
			    optionsPath = _getOptions.path;

			var finalPath = path.resolve(optionsPath || '.', '..');

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

	return commandFactory;
});

module.exports = entry;
