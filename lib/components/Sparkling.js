import React from 'react'
import classNames from 'classnames'

class Sparkling extends React.PureComponent {
	componentDidMount() {
		const model = this.input.getModel()
		model.setPlaceholderText('Sparkling find')

		const buffer = model.getBuffer()
		this.bufferDisposable = buffer.onDidChange(() => {
			this.props.setPattern(buffer.getText())
		})
		this.input.focus()
	}

	render() {
		const {
			options,
			selectedValue,
			data,
			selectedIndex,
			rawDataLength
		} = this.props
		const { preview, renderer, accept } = this.props.options
		const filteredDataLength = data.length

		return (
			<div className="sparkling">
				<div className="sparkling-results-block">
					<div className="sparkling-results" id="sparkling-results">
						{data
							.slice(0, 10)
							.map((item, index) =>
								renderer({ item, index, selectedIndex, accept })
							)}
					</div>
					{preview &&
						selectedValue && (
							<div className="sparkling-preview">{preview(selectedValue)}</div>
						)}
				</div>

				<div
					className={classNames('sparkling-input', {
						'sparkling-input--has-results': filteredDataLength > 0,
						'sparkling-input--no-results': filteredDataLength === 0
					})}
				>
					<div className="sparkling-search-meta-data">{`${filteredDataLength} / ${rawDataLength}`}</div>

					<atom-text-editor
						id="sparkling-editor"
						className="editor mini"
						mini
						data-encoding="utf-8"
						data-grammar="text plain null-grammar"
						ref={input => {
							this.input = input
						}}
					/>
				</div>
			</div>
		)
	}
}

module.exports = Sparkling
