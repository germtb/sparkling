import commandFactoryFactory from './commandFactory'
import componentsFactory from './componentsFactory'
import storeFactory from './storeFactory'
import observablesFactory from './observablesFactory'
import fuzzyFilterFactory from './fuzzyFilterFactory'

export default () => {
	const React = require('react')

	const { Observable } = require('rxjs/Observable')
	require('rxjs/add/observable/combineLatest')
	require('rxjs/add/observable/merge')
	require('rxjs/add/operator/auditTime')
	require('rxjs/add/operator/debounceTime')
	require('rxjs/add/operator/distinctUntilChanged')

	const fuzzysort = require('fuzzysort')
	const { filter, wrap } = fuzzyFilterFactory({ fuzzysort })

	const { createStore, combineReducers } = require('redux')

	const store = storeFactory({ Observable, createStore, combineReducers })

	observablesFactory({ store, Observable, filter })

	const { Provider, connect } = require('react-redux')

	const components = componentsFactory({
		React,
		store,
		Observable,
		wrap,
		filter,
		Provider,
		connect
	})

	const commandFactory = commandFactoryFactory({
		React,
		store,
		Observable,
		wrap,
		filter,
		Provider,
		connect,
		...components
	})

	return {
		React,
		store,
		Observable,
		wrap,
		filter,
		Provider,
		connect,
		...components,
		commandFactory
	}
}
