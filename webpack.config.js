var path = require('path');

module.exports = {
	// Application entry point
	entry: './app.js',
	output:{
		// ﾌｧｲﾙの出力先
		path: __dirname,

		// output file name
		filename :'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.(css)$/,
				// 複数のローダーを"!"で接続できる
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.js$/,
				exclude:/node_modules/,
        		loader: 'babel-loader',
				query: {
//          			optional: ["es7.decorators", "es7.classProperties"]
        		}
			}
		]
	}
};
