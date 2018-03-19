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

			if (
				parent &&
				this.container &&
				parent.getBoundingClientRect().top >
					this.container.getBoundingClientRect().bottom + height
			) {
				return (
					<div
						ref={container => (this.container = container)}
						style={{
							minHeight: height
						}}
					/>
				)
			}

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
				scrollTop: 0,
				// marginHeight: 0,
				marginHeight: props.height
				// maxHeight: props.height
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
			const {
				chunks,
				height,
				lastChunk,
				scrolloading,
				marginHeight,
				maxHeight
			} = this.state
			const { columns } = options

			if (scrolloading) {
				return
			}

			const { scrollTop } = this.container

			const last = chunks[chunks.length - 1]
			const { clientHeight } = lastChunk

			if (height + clientHeight > maxHeight + marginHeight + scrollTop) {
				this.setState({
					height: height + clientHeight,
					scrolloading: true
				})
			} else if (last * columns < data.length) {
				this.setState({
					height: height + clientHeight,
					chunks: [...chunks, last + 1],
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

			const { chunks, height, scrollTop, maxHeight, marginHeight } = this.state

			return (
				<div
					className="sparkling-results-container"
					ref={container => (this.container = container)}
					onScroll={this.onScroll}
					style={{
						display: 'flex',
						flexDirection: 'column',
						maxHeight,
						overflow: 'scroll'
					}}>
					{chunks.map(row => (
						<Chunk
							parent={this.container}
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

								debugger

								if (
									height + clientHeight >
									maxHeight + marginHeight + scrollTop
								) {
									this.setState({
										height: height + clientHeight,
										lastChunk: ref,
										scrolloading: false
									})
								} else if (
									last * columns < data.length &&
									row === chunks.length - 1
								) {
									this.setState({
										height: height + clientHeight,
										chunks: [...chunks, last + 1],
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
		pattern: getPattern(state),
		multiselected: getMultiselected(state)
	}))(SparklingResults)
}
