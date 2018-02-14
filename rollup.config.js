import Babel from 'rollup-plugin-babel'
import Resolve from 'rollup-plugin-node-resolve'
import CommonJs from 'rollup-plugin-commonjs'
import Builtins from 'rollup-plugin-node-builtins'

module.exports = {
	input: './lib/sparkling.js',
	output: {
		format: 'cjs',
		file: './dist/bundle.js'
	},
	external: ['fs', 'path', 'child_process', 'atom'],
	plugins: [
		Babel({
			exclude: ['node_modules/**', '**/*.json']
		}),
		Resolve({
			jsnext: true
		}),
		CommonJs({
			include: 'node_modules/**',
			namedExports: {
				'./node_modules/react/react.js': [
					'createElement',
					'Children',
					'Component',
					'PureComponent'
				]
			}
		}),
		Builtins()
	]
}
