import { Readable } from 'stream'
import replaceTransformFactory from './replaceTransform'

describe('replace stream', () => {
	const streamOutput = (replaceOptions, ...chunks) => {
		const readStream = Readable()
		const replaceTransform = new replaceTransformFactory(replaceOptions)
		readStream._read = () => {}
		readStream.pipe(replaceTransform)
		let output = ''

		replaceTransform.on('data', chunk => {
			output += chunk.toString('utf-8')
		})

		for (const chunk of chunks) {
			readStream.emit('data', chunk)
		}

		return output
	}

	it('replaces a one-line match', () => {
		const output = streamOutput(
			{
				startLine: 0,
				startColumn: 0,
				endLine: 0,
				endColumn: 3,
				replace: 'test'
			},
			'0123456789'
		)
		expect(output).toEqual('test3456789')
	})

	it('replaces a one-line match with newline characters', () => {
		const output = streamOutput(
			{
				startLine: 0,
				startColumn: 0,
				endLine: 0,
				endColumn: 3,
				replace: 'test'
			},
			'0123456789\n0123456789'
		)
		expect(output).toEqual('test3456789\n0123456789')
	})

	it('replaces a two-line match', () => {
		const output = streamOutput(
			{
				startLine: 0,
				startColumn: 0,
				endLine: 1,
				endColumn: 3,
				replace: 'test'
			},
			'0123456789\n0123456789'
		)
		expect(output).toEqual('test3456789')
	})

	it('replaces a three-line match', () => {
		const output = streamOutput(
			{
				startLine: 0,
				startColumn: 5,
				endLine: 2,
				endColumn: 5,
				replace: 'test'
			},
			'0123456789\n0123456789\n0123456789'
		)
		expect(output).toEqual('01234test56789')
	})
})
