import { h, Component } from 'preact'

export default class Find extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const { find, setFind } = this.props

		return (
			<div className="sparking-find sparkling-input-container">
				<input
					id="sparkling-input"
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
