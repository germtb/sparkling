import React from 'react'
import { connect } from 'react-redux'

import { isVisible, getData } from './selectors'

class Sparkling extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		if (!this.props.visible) {
			return null
		}

		if (!this.props.data) {
			return <div>Loading...</div>
		}

		return <div>{this.props.data.map(s => <div>{s}</div>)}</div>
	}
}

module.exports = connect(state => ({
	visible: isVisible(state),
	data: getData(state)
}))(Sparkling)
