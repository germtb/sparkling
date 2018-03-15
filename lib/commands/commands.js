// @flow

import loadDataFactory from './dataSources/commands'

import type { Dependencies, PartialOptions } from '../types'

const iconMap = {
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
}

export default (dependencies: Dependencies): PartialOptions => {
	const { React, classnames, wrap, store } = dependencies

	const loadData = loadDataFactory(dependencies)

	const accept = items => {
		for (const item of items) {
			atom.commands.dispatch(item.activeElement, item.name)
			store.dispatch({ type: 'HIDE' })
		}
	}

	const renderer = ({ item, index, selectedIndex, pattern, multiselected }) => {
		const keybinding = item.keybinding
		const finalClassName = classnames('sparkling-row', {
			['sparkling-row--selected']: index === selectedIndex,
			['sparkling-row--multi-selected']: multiselected
		})

		const wrappedValue = wrap(item.value, pattern)

		return (
			<div
				className={finalClassName}
				aria-role="button"
				onClick={() => accept(item)}
				style={{ display: 'flex', justifyContent: 'space-between' }}
			>
				<span dangerouslySetInnerHTML={{ __html: wrappedValue }} />
				{keybinding && (
					<span>
						{keybinding.keystrokeArray.map(keystroke => (
							<span className="sparkling-keystroke">
								{keystroke
									.split('-')
									.map(key => {
										if (iconMap[key]) {
											return iconMap[key]
										}

										return key
									})
									.join(' ')}
							</span>
						))}
					</span>
				)}
			</div>
		)
	}

	return {
		loadData,
		accept,
		renderer,
		sliceLength: 12,
		columns: 2,
		description: 'Run commands',
		id: 'sparkling-commands',
		multiselect: true
	}
}
