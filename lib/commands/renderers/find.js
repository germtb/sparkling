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

	debugger
	debugger

	const lines = value
		.split('')
		.map((c, index) => {
			if (c === '\t') {
				c = (
					<span
						style={{
							display: 'inline-block',
							width: '20px'
						}}
					/>
				)
			} else if (c === ' ') {
				c = (
					<span
						style={{
							display: 'inline-block',
							width: '10px'
						}}
					/>
				)
			}

			if (indexes.includes(index)) {
				return <span className="highlight">{c}</span>
			}

			return c
		})
		.reduce(
			(lines, character) => {
				if (character === '\n') {
					lines.push([])
				} else {
					lines[lines.length - 1].push(character)
				}

				return lines
			},
			[[]]
		)
		.map((line, index, lines) => {
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
		})

	const finalClassName = classnames('sparkling-row', 'sparkling-row__find', {
		['sparkling-row--selected']: index === selectedIndex
	})

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}>
			<span className={classnames(['icon', ...iconClassForPath(path)])}>
				{path}
			</span>
			{lines}
		</div>
	)
}
