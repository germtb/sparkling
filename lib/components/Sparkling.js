import { h, Component } from 'preact'
import classNames from 'classnames'

export default class Sparkling extends Component {
	componentDidMount() {
		const { pattern } = this.props
		// const model = this.input.getModel()
		// model.setPlaceholderText('Sparkling find')
		//
		// const buffer = model.getBuffer()
		// this.bufferDisposable = buffer.onDidChange(() => {
		// 	this.props.setPattern(buffer.getText())
		// })
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
		const { preview, renderer, accept } = this.props.options
		const filteredDataLength = data.length

		return (
			<div className="sparkling">
				<div className="sparkling-results-block">
					<div className="sparkling-results" id="sparkling-results">
						{data
							.slice(offset, offset + 10)
							.map((item, index) =>
								renderer({ ...item, index, selectedIndex, accept, pattern })
							)}
					</div>
					{preview &&
						selectedValue && (
							<div className="sparkling-preview">{preview(selectedValue)}</div>
						)}
				</div>

				<div className="sparkling-input-container">
					<div className="sparkling-search-meta-data">{`${filteredDataLength} / ${rawDataLength}`}</div>

					<input
						id="sparkling-input"
						className={classNames('sparkling-input native-key-bindings', {
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
