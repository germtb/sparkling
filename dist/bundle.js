'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var child_process = require('child_process');
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var atom$1 = require('atom');

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

var fileIconsService = null;

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

var spawnInProject = function spawnInProject(cmd, args) {
	var cwd = atom.project.getPaths()[0];
	return child_process.spawn(cmd, args, {
		cwd: cwd
	});
};

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


		var finalClassName = classnames(className, index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

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
	var defaultRenderer = defaultRendererFactory(dependencies);

	return function (props) {
		return defaultRenderer(_extends({}, props, {
			className: ['icon'].concat(toConsumableArray(iconClassForPath(props.item.value)))
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

var rendererFactory$1 = (function (dependencies) {
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
		renderer: renderer,
		sliceLength: 20,
		columns: 4,
		description: 'Project navigation',
		id: 'sparkling-ls'
	};
});

var copyFiles = (function (dependencies) {
	var renderer = rendererFactory(dependencies);

	var store = dependencies.store;


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

var moveFiles = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory(dependencies);

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

var removeFiles = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory(dependencies);

	var accept = function accept(file) {
		spawnInProject('rm', [file.value]);

		store.dispatch({
			type: 'REMOVE_ITEM',
			payload: { file: file }
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

		if (relativePath[0] !== '.') {
			relativePath = './' + relativePath;
		}

		store.dispatch({ type: 'HIDE' });
		// store.dispatch({ type: 'SET_DATA', payload: { data: [{ value: '1234' }] } })
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

var rendererFactory$2 = (function (_ref) {
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
		var value = item.value,
		    status = item.status;


		var finalClassName = classnames(className, ['icon'].concat(toConsumableArray(iconClassForPath(value))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

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


	var renderer = rendererFactory$2(dependencies);

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
		renderer: renderer,
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

var gitBranches = (function (_ref) {
	var store = _ref.store;

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
		description: 'git log - Checkout git commit',
		id: 'sparkling-git-commit'
	};
});

var gitStage = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$2(dependencies);

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
		renderer: renderer,
		columns: 3,
		description: 'Stage and unstage git files',
		id: 'sparkling-git-stage'
	};
});

var gitCheckout = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$2(dependencies);

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
		renderer: renderer,
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
		description: 'git reflog - Checkout git commit',
		id: 'sparkling-git-reflog'
	};
});

var rendererFactory$3 = (function (_ref) {
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

		var start = 0;
		var end = value.indexOf(':');
		var wrappedValue = wrap(value.replace(':', ''), pattern, start, end, 'sparkling-line-number');

		var finalClassName = classnames(className, index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

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

var lines = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$3(dependencies);

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
		renderer: renderer
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

var rendererFactory$4 = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    wrap = _ref.wrap;
	return function (_ref2) {
		var item = _ref2.item,
		    pattern = _ref2.pattern,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex,
		    accept = _ref2.accept;
		var start = item.start,
		    end = item.end,
		    value = item.value,
		    path$$1 = item.path;


		var wrappedValue = wrap(value, pattern, start, end, 'find-highlight');

		var finalClassName = classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

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

var find = (function (dependencies) {
	var store = dependencies.store;


	var renderer = rendererFactory$4(dependencies);

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
		renderer: renderer,
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

var rendererFactory$5 = (function (_ref) {
	var React = _ref.React,
	    classnames = _ref.classnames,
	    wrap = _ref.wrap,
	    connect = _ref.connect;

	var replaceRenderer = function replaceRenderer(_ref2) {
		var item = _ref2.item,
		    pattern = _ref2.pattern,
		    index = _ref2.index,
		    selectedIndex = _ref2.selectedIndex,
		    accept = _ref2.accept,
		    replace = _ref2.replace;
		var start = item.start,
		    end = item.end,
		    value = item.value,
		    path$$1 = item.path;


		var wrappedValue = wrap(value, pattern, start, end, 'replace-downlight', '<span class="replace-highlight">' + escapeHTML(replace) + '</span>');

		var finalClassName = classnames(['icon'].concat(toConsumableArray(iconClassForPath(path$$1))), index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row');

		return React.createElement('div', {
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

	return function (props) {
		return React.createElement(Replace, props);
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
		description: 'Autocomplete lines from project',
		id: 'sparkling-autocomplete-lines'
	};
});

var config = {};

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

		var options = _extends({}, defaults$$1, optionsFactory(dependencies));

		var command = function command() {
			var extraOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
		    setPattern = _ref2.setPattern;
		var description = options.description,
		    childrenRenderer = options.childrenRenderer;

		var filteredDataLength = data.length;

		return React.createElement(
			"div",
			{ className: "sparkling-input-container" },
			React.createElement(
				"div",
				{ className: "sparkling-meta-data" },
				React.createElement(
					"span",
					null,
					filteredDataLength + " / " + rawDataLength
				),
				React.createElement(
					"span",
					{ className: "sparkling-command-description" },
					description
				)
			),
			React.createElement(Input, {
				autoFocus: true,
				id: "sparkling-input",
				tabIndex: 1,
				className: classnames('sparkling-input', 'native-key-bindings', {
					'sparkling-input--has-results': filteredDataLength > 0,
					'sparkling-input--no-results': filteredDataLength === 0 && rawDataLength > 0
				}),
				placeholder: "Sparkling fuzzy filter",
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
			pattern: getPattern(state)
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

	return connect(function (state) {
		return {
			visible: isVisible(state),
			options: getOptions(state)
		};
	})(SparklingContainer);
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
				return dispatch({ type: 'SET_EXTRA_INPUT_VALUE', payload: { value: value } });
			}
		};
	})(ExtraInputContainer);
});

var componentsFactory = (function (dependencies) {
	var Input = InputFactory(dependencies);
	dependencies.components = { Input: Input };

	var Sparkling = SparklingContainer(dependencies);
	var FindContainer = FindContainerFactory(dependencies);
	var ExtraInputContainer = ExtraInputContainerFactory(dependencies);

	return {
		Input: Input,
		Sparkling: Sparkling,
		FindContainer: FindContainer,
		ExtraInputContainer: ExtraInputContainer
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
	SHOW: function SHOW(state, _ref2) {
		var payload = _ref2.payload;
		return payload;
	}
})({
	loadData: function loadData() {},
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
	SHOW_INPUT: function SHOW_INPUT(state, _ref7) {
		var payload = _ref7.payload;
		return payload;
	},
	SET_EXTRA_INPUT_VALUE: function SET_EXTRA_INPUT_VALUE(state, _ref8) {
		var value = _ref8.value;
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

	fromSelector(getSelectedValue).debounceTime(100).subscribe(function (selectedValue) {
		var options = getOptions(store.getState());
		var onValue = options.onValue;

		onValue && onValue(selectedValue);
	});

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

	return { wrap: wrap, filter: filter };
});

var dependenciesFactory = (function () {
	var dependencies = {};

	var React = require('react');

	dependencies.React = React;

	var classnames = require('classnames');

	dependencies.classnames = classnames;

	var _require = require('rxjs/Observable'),
	    Observable = _require.Observable;

	require('rxjs/add/observable/combineLatest');
	require('rxjs/add/observable/merge');
	require('rxjs/add/operator/auditTime');
	require('rxjs/add/operator/debounceTime');
	require('rxjs/add/operator/distinctUntilChanged');

	dependencies.Observable = Observable;

	var fuzzysort = require('fuzzysort');

	var _fuzzyFilterFactory = fuzzyFilterFactory({ fuzzysort: fuzzysort }),
	    filter = _fuzzyFilterFactory.filter,
	    wrap = _fuzzyFilterFactory.wrap;

	dependencies.filter = filter;
	dependencies.wrap = wrap;

	var _require2 = require('redux'),
	    createStore = _require2.createStore,
	    combineReducers = _require2.combineReducers;

	dependencies.createStore = createStore;
	dependencies.combineReducers = combineReducers;

	var _storeFactory = storeFactory(dependencies),
	    store = _storeFactory.store,
	    fromAction = _storeFactory.fromAction,
	    fromSelector = _storeFactory.fromSelector;

	dependencies.store = store;
	dependencies.fromAction = fromAction;
	dependencies.fromSelector = fromSelector;

	observablesFactory(dependencies);

	var _require3 = require('react-redux'),
	    Provider = _require3.Provider,
	    connect = _require3.connect;

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

module.exports = {
	subscriptions: null,

	config: config,

	provideSparkling: function provideSparkling() {
		return this.commandFactory;
	},
	bootstrap: function bootstrap() {
		var dependencies = dependenciesFactory();

		var store = dependencies.store,
		    fromAction = dependencies.fromAction,
		    commandFactory = dependencies.commandFactory;


		this.commandFactory = commandFactory;

		fromAction('HIDE').subscribe(function () {
			var editor = atom.workspace.getActiveTextEditor();
			var view = editor && atom.views.getView(editor);
			view && view.focus();
		});

		var reactRoot = document.createElement('div');

		render(reactRoot, dependencies);

		atom.workspace.addBottomPanel({ item: reactRoot, model: {} });

		var filesCommand = this.commandFactory(files);
		var relativePathInsertCommand = this.commandFactory(relativePathInsert);
		var relativePathCopyCommand = this.commandFactory(relativePathCopy);
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
			'sparkling:relativePathInsert': relativePathInsertCommand,
			'sparkling:relativePathCopy': relativePathCopyCommand,
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
