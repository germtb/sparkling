// @flow

import type { Dependencies, Item } from '../../types'

import type { StatelessFunctionalComponent } from 'react'

export default ({
	React,
	classnames,
	wrap,
	utils: { iconClassForPath }
}: Dependencies): StatelessFunctionalComponent<{
	item: Item,
	pattern: string,
	index: number,
	selectedIndex: number,
	accept: any
}> => ({ item, pattern, index, selectedIndex, accept }) => {
	const { startColumn, endColumn, value, path } = item

	const lines = value.split('\n').map((l, index, lines) => {
		const start = index === 0 ? startColumn : 0
		const end = index === lines.length - 1 ? endColumn : l.length
		const wrappedLine = wrap(l, '', start, end, 'find-highlight')
		return <span dangerouslySetInnerHTML={{ __html: wrappedLine }} />
	})

	// const test = 'foof'
	// const test = 'boob'

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
