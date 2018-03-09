import InputFactory from '../components/Input'
import SparklingFactory from '../components/Sparkling'
import FindContainerFactory from '../components/FindContainer'
import ExtraInputContainerFactory from '../components/ExtraInputContainer'

export default dependencies => {
	const { React } = dependencies

	const withSideEffect = observable => onValue => BaseComponent =>
		class SideEffect extends React.PureComponent<*> {
			constructor() {
				super()
				this.subscription = null
			}

			componentDidMount() {
				this.subscription = observable.subscribe(onValue)
			}

			componentWillUnmount() {
				this.subscription.unsubscribe()
			}

			render() {
				return <BaseComponent {...this.props} />
			}
		}

	const Input = InputFactory(dependencies)
	dependencies.components = { Input }

	const Sparkling = SparklingFactory(dependencies)
	const FindContainer = FindContainerFactory(dependencies)
	const ExtraInputContainer = ExtraInputContainerFactory(dependencies)

	return {
		Input,
		Sparkling,
		FindContainer,
		ExtraInputContainer,
		withSideEffect
	}
}
