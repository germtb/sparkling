export default () => onData => {
	const emoji = require('../db/emoji.json')
	onData(
		emoji.map(({ emoji, category, tags, aliases, description }) => ({
			emoji,
			value: `${category} ${tags} ${aliases} ${description}`
		}))
	)

	return () => {}
}
