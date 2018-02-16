import { h, Component } from 'preact'
import classNames from 'classnames'

export default class Sparkling extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const {
			options,
			selectedValue,
			data,
			selectedIndex,
			rawDataLength,
			offset,
			pattern
		} = this.props
		const { preview, renderer, accept, description, id } = options
		const filteredDataLength = data.length

		return (
			<div className="sparkling" id={id}>
				<div className="sparkling-results-block">
					<div className="sparkling-results" id="sparkling-results">
						{data.slice(offset, offset + 10).map((item, index) =>
							renderer({
								item,
								index,
								selectedIndex,
								accept,
								pattern
							})
						)}
					</div>
					{preview &&
						selectedValue && (
							<div className="sparkling-preview">{preview(selectedValue)}</div>
						)}
				</div>

				<div className="sparkling-input-container">
					<div className="sparkling-find-meta-data">
						<span>{`${filteredDataLength} / ${rawDataLength}`}</span>
						<span className="sparkling-command-description">{description}</span>
					</div>
					<input
						id="sparkling-input"
						className={classNames('sparkling-input', 'native-key-bindings', {
							'sparkling-input--has-results': filteredDataLength > 0,
							'sparkling-input--no-results':
								filteredDataLength === 0 && rawDataLength > 0
						})}
						placeholder="Sparkling find"
						ref={input => {
							this.input = input
						}}
						onInput={event => {
							this.props.setPattern(event.target.value)
						}}
						value={this.props.pattern}
					/>
				</div>
			</div>
		)
	}
}
