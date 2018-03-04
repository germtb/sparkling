import { getExtraInput } from '../selectors'

export default ({ React, connect, components }) => {
	const { Input } = components

	const ExtraInputContainer = ({ extraInput, setValue }) => {
		const { value, id, placeholder = '' } = extraInput
		if (!id) {
			return null
		}

		return (
			<div id={id} className="sparkling-input-container">
				<Input
					autoFocus
					value={value}
					setValue={setValue}
					placeholder={placeholder}
				/>
			</div>
		)
	}

	return connect(
		state => ({
			extraInput: getExtraInput(state)
		}),
		dispatch => ({
			setValue: value =>
				dispatch({ type: 'SET_EXTRA_INPUT_VALUE', payload: { value } })
		})
	)(ExtraInputContainer)
}
