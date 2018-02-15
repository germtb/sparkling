import { h, Component } from 'preact'

export default class Search extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const { search, setSearch } = this.props

		return (
			<div className="sparking-search sparkling-input-container">
				<input
					id="sparkling-input"
					className="sparkling-input native-key-bindings"
					placeholder="Find in project"
					ref={input => {
						this.input = input
					}}
					onInput={event => {
						setSearch(event.target.value)
					}}
					value={search}
				/>
			</div>
		)
	}
}
