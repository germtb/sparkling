import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import sizes from 'rollup-plugin-sizes'

module.exports = {
	input: './lib/entry.js',
	output: {
		format: 'cjs',
		file: './dist/bundle.js'
	},
	external: ['fs', 'path', 'child_process', 'atom', 'os'],
	plugins: [
		babel({
			babelrc: false,
			presets: ['es2015-rollup', 'flow'],
			exclude: ['node_modules/**', '**/*.json'],
			plugins: ['transform-object-rest-spread', 'transform-react-jsx']
		}),
		resolve({
			jsnext: true
		}),
		commonJS({
			include: 'node_modules/**',
			namedExports: {
				'./node_modules/react/index.js': [
					'cloneElement',
					'createElement',
					'PropTypes',
					'Children',
					'Component'
				]
			}
		}),
		builtins(),
		sizes()
	]
}
