import SparklingInputFactory from './SparklingInput'
import SparklingResultsFactory from './SparklingResults'

export default dependencies => {
	const { React } = dependencies

	const SparklingInput = SparklingInputFactory(dependencies)
	const SparklingResults = SparklingResultsFactory(dependencies)

	return ({ options }) => {
		const { id } = options

		return (
			<div className="sparkling" id={id}>
				<SparklingResults />
				<SparklingInput key={id} />
			</div>
		)
	}
}
