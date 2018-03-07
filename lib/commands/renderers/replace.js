import { escapeHTML } from '../../utils'
import { getReplace } from '../../selectors'

export default ({
	React,
	classnames,
	wrap,
	connect,
	utils: { iconClassForPath }
}) => {
	const replaceRenderer = ({
		item,
		pattern,
		index,
		selectedIndex,
		accept,
		replace
	}) => {
		const { start, end, value, path } = item

		const wrappedValue = wrap(
			value,
			pattern,
			start,
			end,
			'replace-downlight',
			`<span class="replace-highlight">${escapeHTML(replace)}</span>`
		)

		const finalClassName = classnames(
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

	const Replace = connect(state => ({
		replace: getReplace(state)
	}))(replaceRenderer)

	return props => <Replace {...props} />
}
