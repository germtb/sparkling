import {
	getMultiselected,
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getOffset,
	getPattern
} from '../../selectors'

export default ({ React, connect, classnames, wrap }) => {
	class Chunk extends React.PureComponent {
		componentDidMount() {
			const { onMount } = this.props
			onMount(this.container)
		}

		render() {
			const {
				startIndex,
				options,
				data,
				selectedIndex,
				pattern,
				multiselected
			} = this.props

			const { renderer, accept } = options

			return (
				<div
					ref={container => (this.container = container)}
					className="sparkling-chunk"
					style={{
						display: 'flex',
						flex: 1,
						flexShrink: 0
					}}>
					{data.map((item, index) => {
						const className = classnames('sparkling-row', {
							['sparkling-row--selected']: index + startIndex === selectedIndex,
							['sparkling-row--multi-selected']: multiselected.includes(item)
						})

						const wrappedValue = wrap(item.value, pattern)

						return renderer({
							item,
							accept,
							wrappedValue,
							className
						})
					})}
				</div>
			)
		}
	}

	class SparklingResults extends React.PureComponent {
		constructor(props) {
			super(props)

			this.state = {
				chunks: [],
				height: 0,
				scrollTop: 0
			}

			this.onScroll = this.onScroll.bind(this)
		}

		componentDidUpdate() {
			const { data } = this.props
			const { chunks } = this.state

			if (data.length > 0 && chunks.length === 0) {
				this.setState({
					chunks: [0]
				})
			}
		}

		onScroll() {
			const { data, options } = this.props
			const { chunks, height, lastChunk, scrolloading } = this.state
			const { columns } = options

			if (scrolloading) {
				console.log('this was cool')
				return
			}

			const containerHeight = 200
			const marginHeight = 200 + scrollTop

			const { scrollTop } = this.container

			const last = chunks[chunks.length - 1]
			const { clientHeight } = lastChunk

			if (height + clientHeight > containerHeight + marginHeight) {
				this.setState({
					height: height + clientHeight,
					scrolloading: true
				})
			} else if (last * columns < data.length) {
				this.setState({
					height: height + clientHeight,
					// chunks: [...chunks, last + 1],
					chunks: [...chunks, last + 1, last + 2, last + 3, last + 4],
					scrolloading: true
				})
			} else {
				this.setState({
					height: height + clientHeight,
					scrolloading: true
				})
			}
		}

		render() {
			const {
				data,
				options,
				selectedIndex,
				pattern,
				multiselected
			} = this.props

			const { columns } = options

			const { chunks, height, scrollTop } = this.state
			const containerHeight = 200
			const marginHeight = 200 + scrollTop

			return (
				<div
					className="sparkling-results-container"
					ref={container => (this.container = container)}
					onScroll={this.onScroll}
					style={{
						display: 'flex',
						flexDirection: 'column',
						maxHeight: containerHeight,
						overflow: 'scroll'
					}}>
					{chunks.map(row => (
						<Chunk
							options={options}
							data={data}
							selectedIndex={selectedIndex}
							startIndex={row * columns}
							pattern={pattern}
							multiselected={multiselected}
							data={data.slice(row * columns, row * columns + columns)}
							onMount={ref => {
								const last = chunks[chunks.length - 1]
								const { clientHeight } = ref

								if (height + clientHeight > containerHeight + marginHeight) {
									this.setState({
										height: height + clientHeight,
										lastChunk: ref,
										scrolloading: false
									})
								} else if (last * columns < data.length) {
									this.setState({
										height: height + clientHeight,
										// chunks: [...chunks, last + 1],
										chunks: [...chunks, last + 1, last + 2, last + 3, last + 4],
										lastChunk: ref,
										scrolloading: false
									})
								} else {
									this.setState({
										height: height + clientHeight,
										lastChunk: ref,
										scrolloading: false
									})
								}
							}}
						/>
					))}
				</div>
			)
		}
	}

	return connect(state => ({
		options: getOptions(state),
		data: getSparklingData(state),
		selectedIndex: getIndex(state),
		selectedValue: getSelectedValue(state),
		offset: getOffset(state),
		pattern: getPattern(state),
		multiselected: getMultiselected(state)
	}))(SparklingResults)
}
