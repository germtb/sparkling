// @flow

import { getReplace } from '../../selectors'
import { split } from '../../utils'

import type { Element } from 'react'

import type { Dependencies, AckmateItem } from '../../types'

export default ({
	React,
	classnames,
	connect,
	utils: { iconClassForPath }
}: Dependencies) => {
	const Replace = ({
		item,
		wrappedValue,
		className,
		accept,
		replace
	}: {
		item: AckmateItem,
		className: string,
		pattern: string,
		accept: AckmateItem => void,
		replace: string
	}) => {
		const { startColumn, endColumn, path } = item

		const wrapLine = (
			line: Array<string | Element<string>>,
			index: number,
			lines: Array<Array<string | Element<string>>>
		) => {
			if (index === 0 && lines.length === 1) {
				return (
					<div>
						<span>{line.slice(0, startColumn)}</span>
						<span className="replace-downlight">
							{line.slice(startColumn, endColumn)}
						</span>
						<span className="replace-highlight">{replace}</span>
						<span>{line.slice(endColumn)}</span>
					</div>
				)
			} else if (index === 0) {
				return (
					<div>
						<span>{line.slice(0, startColumn)}</span>
						<span className="replace-downlight">{line.slice(startColumn)}</span>
					</div>
				)
			} else if (index === lines.length - 1) {
				return (
					<div>
						<span className="replace-downlight">
							{line.slice(0, endColumn)}
						</span>
						<span className="replace-highlight">{replace}</span>
						<span>{line.slice(endColumn)}</span>
					</div>
				)
			}

			return <div className="replace-downlight">{line}</div>
		}

		const lines = wrappedValue.reduce(split('\n'), [[]]).map(wrapLine)

		const finalClassName = classnames(className, 'sparkling-row__find', {
			['sparkling-row__find--multiline']: lines.length > 1
		})

		return (
			<div
				className={finalClassName}
				aria-role="button"
				onClick={() => accept(item)}>
				<span className={classnames('icon', ...iconClassForPath(path))}>
					{path}
				</span>
				{lines}
			</div>
		)
	}

	const ReplaceWithConnect = connect(state => ({
		replace: getReplace(state)
	}))(Replace)

	return (props: {
		item: AckmateItem,
		pattern: string,
		index: number,
		selectedIndex: number,
		accept: AckmateItem => void,
		replace: string
	}) => <ReplaceWithConnect {...props} />
}
