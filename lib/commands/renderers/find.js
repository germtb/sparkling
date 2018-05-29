import { split } from '../../utils'

export default ({ React, classnames, utils: { iconClassForPath } }) => ({
	item,
	wrappedValue,
	className,
	accept
}) => {
	const { startColumn, endColumn, path } = item

	const wrapLine = (line, index, lines) => {
		if (index === 0) {
			return (
				<div>
					<span
						className={classnames(
							'icon',
							'sparkling-path',
							...iconClassForPath(path)
						)}>
						{line}
					</span>
				</div>
			)
		} else if (index === 1 && lines.length === 2) {
			return (
				<div>
					<span>{line.slice(0, startColumn)}</span>
					<span className="find-highlight">
						{line.slice(startColumn, endColumn)}
					</span>
					<span>{line.slice(endColumn)}</span>
				</div>
			)
		} else if (index === 1) {
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
				['sparkling-row__find--multiline']: lines.length > 2
			})}
			aria-role="button"
			onClick={() => accept(item)}>
			{lines}
		</div>
	)
}
