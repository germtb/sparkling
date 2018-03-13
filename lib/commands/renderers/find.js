// @flow

import { split } from '../../utils'

import type { StatelessFunctionalComponent, Element } from 'react'

import type { Dependencies, Item } from '../../types'

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

	const wrapCharacter = (c: string, index: number): string | Element<string> =>
		indexes.includes(index) || c === '\t' || c === ' ' ? (
			<span
				className={classnames({
					['highlight']: indexes.includes(index),
					['sparkling-tab']: c === '\t',
					['sparkling-space']: c === ' '
				})}
			>
				{c}
			</span>
		) : (
			c
		)

	const wrapLine = (
		line: Array<string | Element<*>>,
		index: number,
		lines: Array<Array<string | Element<*>>>
	): Element<*> => {
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
		.map(wrapCharacter)
		.reduce(split('\n'), [[]])
		.map(wrapLine)

	const finalClassName = classnames('sparkling-row', 'sparkling-row__find', {
		['sparkling-row--selected']: index === selectedIndex,
		['sparkling-row__find--multiline']: lines.length > 1
	})

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
		>
			<span className={classnames('icon', ...iconClassForPath(path))}>
				{path}
			</span>
			{lines}
		</div>
	)
}
