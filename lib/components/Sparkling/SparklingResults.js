import {
	getMultiselected,
	getSparklingData,
	getIndex,
	getOptions,
	getSelectedValue,
	getPattern
} from '../../selectors'

export default ({ React, connect, classnames, wrap }) => {
	class Chunk extends React.PureComponent {
		constructor() {
			super()
			this.state = {
				height: 0
			}
		}

		componentDidMount() {
			const { onMount } = this.props
			onMount(this.container)
			this.setState({
				height: this.container.clientHeight
			})
		}

		componentDidUpdate(prevProps) {
			if (prevProps.selectedIndex === this.props.selectedIndex) {
				return
			}

			const { startIndex, data, selectedIndex } = this.props

			if (data.some((_, index) => index + startIndex === selectedIndex)) {
				this.container.scrollIntoView(false)
			}
		}

		render() {
			const {
				startIndex,
				options,
				data,
				selectedIndex,
				pattern,
				multiselected,
				parent
			} = this.props

			const { renderer, accept } = options

			const { height } = this.state

			// if (
			// 	parent &&
			// 	this.container &&
			// 	parent.getBoundingClientRect().bottom <
			// 		this.container.getBoundingClientRect().bottom
			// ) {
			// 	return (
			// 		<div
			// 			ref={container => (this.container = container)}
			// 			style={{
			// 				minHeight: height
			// 			}}
			// 		/>
			// 	)
			// }

			return (
				<div
					ref={container => (this.container = container)}
					className="sparkling-chunk"
					style={{
						display: 'flex',
						flex: 1,
						flexShrink: 0
					}}
				>
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
				// marginHeight: 0,
				marginHeight: props.height,
				maxHeight: props.height
			}

			this.onScroll = this.onScroll.bind(this)
			this.resize = this.resize.bind(this)
		}

		onScroll() {
			const { scrolloading } = this.state

			if (scrolloading) {
				return
			}

			this.setState({ scrolloading: true })
		}

		resize() {
			const { data, options } = this.props
			const { columns } = options
			const {
				chunks,
				maxHeight,
				marginHeight,
				container,
				lastChunk
			} = this.state

			if (!container || !lastChunk) {
				return
			}

			const last = chunks[chunks.length - 1]
			const { top } = container.getBoundingClientRect()
			const { bottom } = lastChunk.getBoundingClientRect()
			const delta = bottom - top
			let newChunks = chunks

			if (last * columns < data.length && delta < maxHeight + marginHeight) {
				newChunks = [...chunks, last + 1]
			} else if (delta > maxHeight + 2 * marginHeight) {
				newChunks = chunks.slice(0, -1)
			}

			this.setState({
				chunks: newChunks,
				scrolloading: false
			})
		}

		componentDidUpdate() {
			const { data } = this.props
			const { chunks } = this.state

			if (data.length > 0 && chunks.length === 0) {
				this.setState({
					chunks: [0]
				})
			}

			this.resize()
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
			const { chunks, maxHeight } = this.state

			return (
				<div
					className="sparkling-results-container"
					ref={container => {
						if (container) {
							this.setState({
								container
							})
						}
					}}
					onScroll={this.onScroll}
					style={{
						display: 'flex',
						flexDirection: 'column',
						maxHeight,
						overflow: 'scroll'
					}}
				>
					{this.state.container &&
						chunks.map(row => (
							<Chunk
								parent={this.state.container}
								options={options}
								data={data}
								selectedIndex={selectedIndex}
								startIndex={row * columns}
								pattern={pattern}
								multiselected={multiselected}
								data={data.slice(row * columns, row * columns + columns)}
								onMount={lastChunk => {
									if (row !== chunks.length - 1) {
										return
									}

									if (lastChunk) {
										this.setState({
											lastChunk
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
		pattern: getPattern(state),
		multiselected: getMultiselected(state)
	}))(SparklingResults)
}
