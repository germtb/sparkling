import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getSearch, isSearchVisible } from '../selectors'

export default class Search extends Component {
	componentDidMount() {
		this.input.focus()
	}

	render() {
		const { visible, search, setSearch } = this.props

		return (
			<div className="sparking-search sparkling-input-container">
				<input
					id="sparkling-input"
					className="sparkling-input native-key-bindings"
					placeholder="Sparkling find"
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
