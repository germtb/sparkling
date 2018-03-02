// @flow

declare type Workspace = {
	open: string => void,
	getActiveTextEditor: () => Editor,
	addBottomPanel: ({ item: HTMLDivElement, model: {} }) => void
}

declare type Project = {
	getPaths: () => [string]
}

declare type Packages = {
	hasActivatedInitialPackages: () => boolean,
	onDidActivateInitialPackages: (() => void) => void
}

declare type Subscription = {}

declare type Commands = {
	add: (string, { [string]: () => void }) => Subscription
}

declare type Views = {
	getView: Editor => View
}

declare type View = {
	focus: () => void
}

declare type Editor = {
	getSelectedText: () => string,
	getPath: () => string
}

declare var atom: {
	workspace: Workspace,
	project: Project,
	views: Views,
	packages: Packages,
	commands: Commands
}
