import InputFactory from '../components/Input'
import SparklingFactory from '../components/Sparkling'
import FindContainerFactory from '../components/FindContainer'
import ExtraInputContainerFactory from '../components/ExtraInputContainer'

export default dependencies => {
	const Input = InputFactory(dependencies)
	const Sparkling = SparklingFactory({ ...dependencies, Input })
	const FindContainer = FindContainerFactory({
		...dependencies,
		Input
	})
	const ExtraInputContainer = ExtraInputContainerFactory({
		...dependencies,
		Input
	})

	return {
		Input,
		Sparkling,
		FindContainer,
		ExtraInputContainer
	}
}
