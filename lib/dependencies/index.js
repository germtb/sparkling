import React from 'react'
import classnames from 'classnames'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/auditTime'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

import fuzzysort from 'fuzzysort'
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import commandFactoryFactory from './commandFactory'

import utilsFactory from './utilsFactory'
import componentsFactory from './componentsFactory'
import storeFactory from './storeFactory'
import observablesFactory from './observablesFactory'
import fuzzyFilterFactory from './fuzzyFilterFactory'

import type { Dependencies } from '../types'

export default ({ fileIconsService }): Dependencies => {
	const dependencies = {
		fileIconsService,
		React,
		classnames,
		Observable,
		createStore,
		combineReducers
	}

	const utils = utilsFactory(dependencies)
	dependencies.utils = utils

	const { filter, wrap } = fuzzyFilterFactory({ fuzzysort })
	dependencies.filter = filter
	dependencies.wrap = wrap

	const { store, fromAction, fromSelector } = storeFactory(dependencies)
	dependencies.store = store
	dependencies.fromAction = fromAction
	dependencies.fromSelector = fromSelector

	observablesFactory(dependencies)
	dependencies.Provider = Provider
	dependencies.connect = connect

	const components = componentsFactory(dependencies)
	dependencies.components = components

	const commandFactory = commandFactoryFactory(dependencies)
	dependencies.commandFactory = commandFactory

	return dependencies
}
