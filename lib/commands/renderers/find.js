// @flow

import type { Dependencies, Item } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	classnames,
	single,
	utils: { iconClassForPath }
}: Dependencies): StatelessFunctionalComponent<{
	item: Item,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any
}> => ({ item, pattern, index, selectedIndex, accept }) => {
	const { startColumn, endColumn, value, path } = item

	const match = single(pattern, value)
	const indexes = match ? match.indexes : []

	const wrapChar = (c, index) =>
		indexes.includes(index) ? (
			<span
				className={classnames('highlight', {
					['sparkling-tab']: c === '\t',
					['sparkling-space']: c === ' '
				})}
			>
				{c}
			</span>
		) : (
			c
		)

	const split = splitValue => (acc, value) => {
		if (value === splitValue) {
			acc.push([])
		} else {
			acc[acc.length - 1].push(value)
		}

		return acc
	}

	const wrapLine = (line, index, lines) => {
		if (index === 0 && lines.length === 1) {
			return (
				<div>
					<span>{line.slice(0, startColumn)}</span>
					<span className="find-highlight">
						{line.slice(startColumn, endColumn)}
					</span>
					<span>{line.slice(endColumn)}</span>
				</div>
			)
		} else if (index === 0) {
			return (
				<div>
					<span>{line.slice(0, startColumn)}</span>
					<span className="find-highlight">{line.slice(startColumn)}</span>
				</div>
			)
		} else if (index === lines.length - 1) {
			return (
				<div>
					<span className="find-highlight">{line.slice(0, endColumn)}</span>
					<span>{line.slice(endColumn)}</span>
				</div>
			)
		}

		return <div className="find-highlight">{line}</div>
	}

	const lines = value
		.split('')
		.map(wrapChar)
		.reduce(split('\n'), [[]])
		.map(wrapLine)

	const finalClassName = classnames('sparkling-row', 'sparkling-row__find', {
		['sparkling-row--selected']: index === selectedIndex
	})

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
		>
			<span className={classnames(['icon', ...iconClassForPath(path)])}>
				{path}
			</span>
			{lines}
		</div>
	)
}
