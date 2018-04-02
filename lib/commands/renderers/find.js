// @flow

import { split } from '../../utils'

import type { StatelessFunctionalComponent, Element } from 'react'

import type { Dependencies, AckmateItem } from '../../types'

export default ({
	React,
	classnames,
	utils: { iconClassForPath }
}: Dependencies): StatelessFunctionalComponent<{
	item: AckmateItem,
	wrappedValue: Array<Element<string> | string>,
	accept: any,
	className: string
}> => ({ item, wrappedValue, className, accept }) => {
	const { startColumn, endColumn, path } = item

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

	const lines = wrappedValue.reduce(split('\n'), [[]]).map(wrapLine)

	return (
		<div
			className={classnames(className, 'sparkling-row__find', {
				['sparkling-row__find--multiline']: lines.length > 1
			})}
			aria-role="button"
			onClick={() => accept(item)}>
			<span
				className={classnames(
					'icon',
					'sparkling-path',
					...iconClassForPath(path)
				)}>
				{path}
			</span>
			{lines}
		</div>
	)
}
