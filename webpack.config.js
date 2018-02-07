const path = require('path')

module.exports = {
	entry: './lib/sparkling.js',
	target: 'atom',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		libraryTarget: 'commonjs2'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel-loader'],
				exclude: /node_modules/
			}
		]
	},
	externals: [
		{
			atom: 'atom',
			remote: 'remote'
		}
	]
}
