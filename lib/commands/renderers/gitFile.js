import { h } from 'preact'
import classNames from 'classnames'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

import { iconClassForPath } from '../../utils'

export default ({ item, pattern, className, index, selectedIndex, accept }) => {
	const { value, status } = item

	const finalClassName = classNames(
		className,
		['icon', ...iconClassForPath(value)],
		index === selectedIndex ? 'sparkling-row selected' : 'sparkling-row'
	)

	const wrappedValue =
		pattern && pattern.length ? fuzzaldrinPlus.wrap(value, pattern) : value

	const statusClassName = classNames('git-status', {
		['git-status-modified']: status === 'M',
		['git-status-modified-staged']: status === 'MM',
		['git-status-new-file']: status === 'A',
		['git-status-new-file-staged']: status === 'AM',
		['git-status-deleted']: status === 'D',
		['git-status-deleted-staged']: status === 'DD',
		['git-status-untracked']: status === '??'
	})

	let statusLabel

	if (status === 'M') {
		statusLabel = 'modified'
	} else if (status === '??') {
		statusLabel = 'untracked'
	} else if (status === 'MM') {
		statusLabel = 'modified'
	} else if (status === 'D') {
		statusLabel = 'deleted'
	} else if (status === 'DD') {
		statusLabel = 'deleted'
	} else if (status === 'A') {
		statusLabel = 'new file'
	} else if (status === 'AM') {
		statusLabel = 'new file'
	} else {
		statusLabel = status
	}

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
		>
			<span className={statusClassName}>{statusLabel}</span>
			<span dangerouslySetInnerHTML={{ __html: wrappedValue }} />
		</div>
	)
}
