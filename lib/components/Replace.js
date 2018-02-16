import { h, Component } from 'preact'

export default class Replace extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const { find, replace, setReplace, setFind } = this.props

		return (
			<div className="sparking-replace sparkling-input-container">
				<input
					tabIndex={0}
					className="sparkling-input native-key-bindings"
					placeholder="Find in project"
					ref={input => {
						this.input = input
					}}
					onInput={event => {
						setFind(event.target.value)
					}}
					value={find}
				/>
				<input
					tabIndex={1}
					className="sparkling-input native-key-bindings"
					placeholder="Replace"
					onInput={event => {
						setReplace(event.target.value)
					}}
					value={replace}
				/>
			</div>
		)
	}
}
