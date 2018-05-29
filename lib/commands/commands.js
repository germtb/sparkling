

import loadDataFactory from './dataSources/commands'



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

export default (dependencies              ) => {
	const { React, store } = dependencies

	const loadData = loadDataFactory(dependencies)

	const accept = (items                    ) => {
		for (const item of items) {
			atom.commands.dispatch(item.activeElement, item.name)
			store.dispatch({ type: 'HIDE' })
		}
	}

	const renderer = ({
		item,
		wrappedValue,
		className
	}



  ) => {
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
		columns: 2,
		description: 'Run commands',
		id: 'sparkling-commands',
		multiselect: true
	}
}
