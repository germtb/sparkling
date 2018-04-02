import { split } from '../../utils'

export default ({ React, classnames, utils: { iconClassForPath } }) => ({
	item,
	className,
	accept,
	wrappedValue
}) => {
	const { path, status } = item

	const finalClassName = classnames(
		className,
		'icon',
		...iconClassForPath(path)
	)

	const lines = wrappedValue.reduce(split('\n'), [[]]).map((line, index) => {
		if (index === 0) {
			if (status === 'M ') {
				return (
					<span
						className={classnames('git-status', 'git-status-modified-staged')}>
						{line}
					</span>
				)
			} else if (status === ' M') {
				return (
					<span className={classnames('git-status', 'git-status-modified')}>
						{line}
					</span>
				)
			} else if (status === 'MM') {
				return (
					<span className="git-status">
						<span className="git-status-modified-staged">
							{line.slice(0, line.length / 2)}
						</span>
						<span className="git-status-modified">
							{line.slice(line.length / 2)}
						</span>
					</span>
				)
			} else if (status === '??') {
				return (
					<span className={classnames('git-status', 'git-status-untracked')}>
						{line}
					</span>
				)
			} else if (status === 'D ') {
				return (
					<span
						className={classnames('git-status', 'git-status-deleted-staged')}>
						{line}
					</span>
				)
			} else if (status === ' D') {
				return (
					<span className={classnames('git-status', 'git-status-deleted')}>
						{line}
					</span>
				)
			} else if (status === 'AD') {
				return (
					<span className={classnames('git-status', 'git-status-deleted')}>
						{line}
					</span>
				)
			} else if (status === 'DD') {
				return (
					<span className="git-status">
						<span className="git-status-deleted-staged">
							{line.slice(0, line.length / 2)}
						</span>
						<span className="git-status-deleted">
							{line.slice(line.length / 2)}
						</span>
					</span>
				)
			} else if (status === 'A ') {
				return (
					<span
						className={classnames('git-status', 'git-status-new-file-staged')}>
						{line}
					</span>
				)
			} else if (status === ' A') {
				return (
					<span
						className={classnames('git-status', 'git-status-new-file-staged')}>
						{line}
					</span>
				)
			} else if (status === 'AM') {
				return (
					<span
						className={classnames('git-status', 'git-status-new-file-staged')}>
						{line}
					</span>
				)
			}

			return <span className="git-status">{line}</span>
		}

		return line
	})

	return (
		<div
			className={finalClassName}
			aria-role="button"
			onClick={() => accept(item)}>
			{lines}
		</div>
	)
}
