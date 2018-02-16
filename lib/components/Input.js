import { h, Component } from 'preact'
import classNames from 'classnames'

export default class Input extends Component {
	componentDidMount() {
		if (this.props.autoFocus) {
			this.input.focus()
		}
	}

	render() {
		const {
			id,
			setValue,
			value,
			className,
			placeholder,
			tabIndex = -1
		} = this.props

		return (
			<input
				id={id}
				tabIndex={tabIndex}
				className={classNames('sparkling-input native-key-bindings', className)}
				placeholder={placeholder}
				onInput={event => {
					setValue(event.target.value)
				}}
				value={value}
				ref={input => {
					this.input = input
				}}
			/>
		)
	}
}
