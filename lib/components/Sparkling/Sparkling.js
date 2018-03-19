import SparklingInputFactory from './SparklingInput'
import SparklingResultsFactory from './SparklingResults'

export default dependencies => {
	const { React } = dependencies

	const SparklingInput = SparklingInputFactory(dependencies)
	const SparklingResults = SparklingResultsFactory(dependencies)

	return ({ options }) => {
		const { id, height } = options

		return (
			<div className="sparkling" id={id}>
				<SparklingResults height={height} />
				<SparklingInput key={id} />
			</div>
		)
	}
}
