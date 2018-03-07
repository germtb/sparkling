const CompositeDisposable = require('atom').CompositeDisposable

const config = require('./config')

module.exports = {
	subscriptions: null,

	commandFactoryPromise: null,

	config,

	fileIconsServicePromise: null,

	fileIconsServiceResolve: null,

	provideSparkling() {
		return this.commandFactoryPromise
	},

	async activate() {
		this.subscriptions = new CompositeDisposable()

		let commandFactoryResolve = null

		this.commandFactoryPromise = new Promise(resolve => {
			commandFactoryResolve = resolve
		})

		this.fileIconsServicePromise = new Promise(resolve => {
			this.fileIconsServiceResolve = resolve
		})

		this.subscriptions.add(
			atom.packages.onDidActivateInitialPackages(async () => {
				const fileIconsService = await this.fileIconsServicePromise
				const bootstrap = require('../dist/bundle')
				const commandFactory = bootstrap({
					subscriptions: this.subscriptions,
					fileIconsService
				})
				commandFactoryResolve(commandFactory)
			})
		)
	},

	deactivate() {
		this.subscriptions.dispose()
		this.subscriptions = null
	},

	serialize() {
		return {}
	},

	consumeFileIcons(service) {
		this.fileIconsServiceResolve(service)
	}
}
