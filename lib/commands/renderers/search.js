import { h } from 'preact'
import classNames from 'classnames'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import { iconClassForPath, interspere } from '../../utils'
import { RG_RESULT } from '../../constants'

export default ({ item, pattern, index, selectedIndex, accept }) => {
	const { search, value, path } = item

	const fuzzyWrappedValue =
		pattern && pattern.length
			? fuzzaldrinPlus
					.wrap(value.replace(RG_RESULT, search), pattern)
					.replace(search, RG_RESULT)
			: value

	const wrappedValue = interspere(
		fuzzyWrappedValue.split(RG_RESULT),
		`<span class="search-highlight">${search}</span>`
	).join()

	const finalClassName = classNames(
		['icon', ...iconClassForPath(path)],
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	)

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
			dangerouslySetInnerHTML={{ __html: wrappedValue }}
		/>
	)
}
