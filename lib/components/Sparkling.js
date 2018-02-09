import React from 'react'

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
						{data.map((value, index) =>
							renderer({ value, index, selectedIndex })
						)}
					</div>
					{preview &&
						selectedValue && (
							<div className="sparkling-preview">{preview(selectedValue)}</div>
						)}
				</div>

				<div className="sparkling-input">
					<atom-text-editor
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
