import commandFactoryFactory from './commandFactory'
import componentsFactory from './componentsFactory'
import storeFactory from './storeFactory'
import observablesFactory from './observablesFactory'
import fuzzyFilterFactory from './fuzzyFilterFactory'

import type { Dependencies } from '../types'

export default (): Dependencies => {
	const dependencies = {}

	const React = require('react')

	dependencies.React = React

	const classnames = require('classnames')

	dependencies.classnames = classnames

	const { Observable } = require('rxjs/Observable')
	require('rxjs/add/observable/combineLatest')
	require('rxjs/add/observable/merge')
	require('rxjs/add/operator/auditTime')
	require('rxjs/add/operator/debounceTime')
	require('rxjs/add/operator/distinctUntilChanged')

	dependencies.Observable = Observable

	const fuzzysort = require('fuzzysort')
	const { filter, wrap } = fuzzyFilterFactory({ fuzzysort })

	dependencies.filter = filter
	dependencies.wrap = wrap

	const { createStore, combineReducers } = require('redux')

	dependencies.createStore = createStore
	dependencies.combineReducers = combineReducers

	const { store, fromAction, fromSelector } = storeFactory(dependencies)

	dependencies.store = store
	dependencies.fromAction = fromAction
	dependencies.fromSelector = fromSelector

	observablesFactory(dependencies)

	const { Provider, connect } = require('react-redux')

	dependencies.Provider = Provider
	dependencies.connect = connect

	const components = componentsFactory(dependencies)

	dependencies.components = components

	const commandFactory = commandFactoryFactory(dependencies)

	dependencies.commandFactory = commandFactory

	return dependencies
}
