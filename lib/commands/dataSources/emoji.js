// @flow

import type { LoadData, EmojiItem } from '../../types'

export default (): LoadData<EmojiItem> => onData => {
	// $FlowFixMe
	const emoji = require('../db/emoji.json')
	onData(
		emoji.map(({ emoji, category, tags, aliases, description }) => ({
			emoji,
			value: `${category} ${tags} ${aliases} ${description}`
		}))
	)

	return () => {}
}
