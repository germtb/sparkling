// @flow

import loadDataFactory from './dataSources/commands'

import type { Dependencies, CommandItem } from '../types'

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

export default (dependencies: Dependencies) => {
	const { React, store } = dependencies

	const loadData = loadDataFactory(dependencies)

	const accept = (items: Array<CommandItem>) => {
		for (const item of items) {
			atom.commands.dispatch(item.activeElement, item.name)
			store.dispatch({ type: 'HIDE' })
		}
	}

	const renderer = ({
		item,
		wrappedValue,
		className
	}: {
		item: CommandItem,
		wrappedValue: string,
		className: string
	}) => {
		const keybinding = item.keybinding

		return (
			<div
				className={className}
				aria-role="button"
				onClick={() => accept([item])}
				style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>{wrappedValue}</span>
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
