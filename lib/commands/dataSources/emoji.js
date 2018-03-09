// @flow

import type { LoadData, Cancel } from '../../types'

export default (): (LoadData => Cancel) => (onData: LoadData): Cancel => {
	const emoji = require('../db/emoji.json')
	onData(
		emoji.map(({ emoji, category, tags, aliases, description }) => ({
			emoji,
			value: `${category} ${tags} ${aliases} ${description}`
		}))
	)

	return () => {}
}
