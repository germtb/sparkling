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
		console.log('Rerendering')

		return (
			<div className="sparkling">
				<div className="sparkling-results-block">
					<div className="sparkling-results">
						{this.props.data.map((s, i) => {
							const className = i === this.props.index ? 'row selected' : 'row'
							return <div className={className}>{s}</div>
						})}
					</div>
					{this.props.preview &&
						this.props.selectedValue && (
							<div className="sparkling-preview">
								{this.props.preview(this.props.selectedValue)}
							</div>
						)}
				</div>

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
		)
	}
}

module.exports = Sparkling
