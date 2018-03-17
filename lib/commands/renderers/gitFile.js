export default ({ React, classnames, wrap, utils: { iconClassForPath } }) => ({
	item,
	pattern,
	className,
	index,
	selectedIndex,
	accept,
	multiselected
}) => {
	const { value, status } = item

	const finalClassName = classnames(
		className,
		'sparkling-row',
		'icon',
		...iconClassForPath(value),
		{
			['sparkling-row--multi-selected']: multiselected,
			['sparkling-row--selected']: index === selectedIndex
		}
	)

	const wrappedValue = wrap(value, pattern)

	let statusLabel

	if (status === 'M ') {
		statusLabel = <span className="git-status-modified-staged">modified</span>
	} else if (status === ' M') {
		statusLabel = <span className="git-status-modified">modified</span>
	} else if (status === 'MM') {
		statusLabel = [
			<span className="git-status-modified-staged">modi</span>,
			<span className="git-status-modified">fied</span>
		]
	} else if (status === '??') {
		statusLabel = <span className="git-status-untracked">untracked</span>
	} else if (status === 'D ') {
		statusLabel = <span className="git-status-deleted-staged">deleted</span>
	} else if (status === ' D') {
		statusLabel = <span className="git-status-deleted">deleted</span>
	} else if (status === 'AD') {
		statusLabel = <span className="git-status-deleted">deleted</span>
	} else if (status === 'DD') {
		statusLabel = [
			<span className="git-status-deleted-staged">del</span>,
			<span className="git-status-deleted">eted</span>
		]
	} else if (status === 'A ') {
		statusLabel = <span className="git-status-new-file-staged">new file</span>
	} else if (status === ' A') {
		statusLabel = <span className="git-status-new-file-staged">new file</span>
	} else if (status === 'AM') {
		statusLabel = <span className="git-status-new-file-staged">new file</span>
	} else {
		statusLabel = status
	}

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}
		>
			<span className="git-status">{statusLabel}</span>
			<span>{wrappedValue}</span>
		</div>
	)
}
