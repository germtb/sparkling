// @lflow

import { getExtraInput } from '../selectors'

import type { Dependencies } from '../types'

export default ({ React, connect, components }: Dependencies) => {
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
				dispatch({ type: 'SET_EXTRA_INPUT', payload: { value } })
		})
	)(ExtraInputContainer)
}
