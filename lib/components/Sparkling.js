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
		const { options, selectedValue, data, selectedIndex } = this.props
		const { preview, renderer } = this.props.options

		return (
			<div className="sparkling">
				<div className="sparkling-results-block">
					<div className="sparkling-results">
						{data.map((item, index) =>
							renderer({ item, index, selectedIndex })
						)}
					</div>
					{preview &&
						selectedValue && (
							<div className="sparkling-preview">{preview(selectedValue)}</div>
						)}
				</div>

				<div
					className={classNames('sparkling-input', {
						'sparkling-input--has-results': this.props.data.length > 0,
						'sparkling-input--no-results': this.props.data.length === 0
					})}
				>
					<div>
						{this.props.data.length
							? `${selectedIndex + 1} / ${this.props.data.length}`
							: 'No results'}
					</div>

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
