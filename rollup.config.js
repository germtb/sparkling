import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import sizes from 'rollup-plugin-sizes'

module.exports = {
	input: './lib/sparkling.js',
	output: {
		format: 'cjs',
		file: './dist/bundle.js'
	},
	external: ['fs', 'path', 'child_process', 'atom'],
	plugins: [
		babel({
			exclude: ['node_modules/**', '**/*.json']
		}),
		resolve({
			jsnext: true
		}),
		commonJS({
			include: 'node_modules/**',
			namedExports: {
				'./node_modules/preact/dist/preact.js': [
					'h:',
					'createElement',
					'cloneElement',
					'Component',
					'render',
					'rerender',
					'options'
				]
			}
		}),
		builtins(),
		sizes()
	]
}
