import InputFactory from '../components/Input'
import SparklingFactory from '../components/Sparkling'
import FindContainerFactory from '../components/FindContainer'
import ExtraInputContainerFactory from '../components/ExtraInputContainer'

export default dependencies => {
	const Input = InputFactory(dependencies)
	dependencies.components = { Input }

	const Sparkling = SparklingFactory(dependencies)
	const FindContainer = FindContainerFactory(dependencies)
	const ExtraInputContainer = ExtraInputContainerFactory(dependencies)

	return {
		Input,
		Sparkling,
		FindContainer,
		ExtraInputContainer
	}
}
