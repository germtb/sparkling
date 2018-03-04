export default ({ React, classnames }) => {
	return class Input extends React.PureComponent {
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
					className={classnames(
						'sparkling-input native-key-bindings',
						className
					)}
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
}
