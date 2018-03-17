// @flow

import { split } from '../../utils'

import type { StatelessFunctionalComponent, Element } from 'react'

import type { Dependencies, AckmateItem } from '../../types'

export default ({
	React,
	classnames,
	wrap,
	utils: { iconClassForPath }
}: Dependencies): StatelessFunctionalComponent<{
	item: AckmateItem,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any
}> => ({ item, pattern, index, selectedIndex, accept }) => {
	const { startColumn, endColumn, value, path } = item

	const wrapLine = (
		line: Array<Element<string> | string>,
		index: number,
		lines: Array<Array<Element<string> | string>>
	): Element<string> => {
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

	const lines = wrap(value, pattern)
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
			<span
				className={classnames(
					'icon',
					'sparkling-path',
					...iconClassForPath(path)
				)}
			>
				{path}
			</span>
			{lines}
		</div>
	)
}
