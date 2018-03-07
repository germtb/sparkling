// @flow

type Cursor = {}

type Editor = {
	getPath: () => string,
	getSelectedText: () => string,
	insertText: string => void,
	cursors: () => Array<Cursor>,
	setCursorBufferPosition: ([number, number]) => void
}

type Workspace = {
	getActiveTextEditor: () => Editor,
	open: (
		url: string,
		options?: { initialLine?: number, initialColumn?: number }
	) => void,
	addBottomPanel: ({ item: any, model: {} }) => void
}

type Project = {
	getPaths: () => Array<string>
}

type View = {
	focus: () => void
}

type Views = {
	getView: Editor => View
}

type Clipboard = {
	write: string => void
}

type Subscription = {}

type Command = {
	displayName: string,
	name: string
}

type Commands = {
	add: (string, { [string]: any }) => Subscription,
	dispatch: (element: *, name: string) => void,
	findCommands: ({ target: * }) => Array<Command>
}

type Keymap = {
	command: string
}

type Keymaps = {
	findKeyBindings: ({ target: * }) => Array<Keymap>
}

type Packages = {
	hasActivatedInitialPackages: () => boolean,
	onDidActivateInitialPackages: (() => void) => void
}

declare var atom: {
	workspace: Workspace,
	project: Project,
	views: Views,
	clipboard: Clipboard,
	commands: Commands,
	keymaps: Keymaps,
	packages: Packages
}

type CompositeDisposable = {}

declare module 'atom' {
	declare var CompositeDisposable: CompositeDisposable
}
