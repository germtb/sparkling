import { h } from 'preact'

import SparklingInput from './SparklingInput'
import SparklingResults from './SparklingResults'

export default ({ options }) => {
	const { id } = options

	return (
		<div className="sparkling" id={id}>
			<SparklingResults />
			<SparklingInput />
		</div>
	)
}
