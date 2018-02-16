import { h, Component } from 'preact'

export default class Replace extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const { find, setFind } = this.props

		return (
			<div className="sparking-replace sparkling-input-container">
				<input
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
			</div>
		)
	}
}
