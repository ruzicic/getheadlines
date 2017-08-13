const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

const bootstrapEntryPoints = require('./webpack.bootstrap.config');

const isProduction = process.env.NODE_ENV === 'production';

const cssDev = [
	'style-loader',
	'css-loader?sourceMap',
	'sass-loader'
];
const cssProd = ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: [
		{ loader: 'css-loader' },
		{ loader: 'sass-loader' }
	]
});

const cssConfig = isProduction ? cssProd : cssDev;
const bootstrapConfig = isProduction ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
	entry: {
		app: './src/assets/js/app.js',
		home: './src/assets/js/home.js',
		bootstrap: bootstrapConfig
	},
	output: {
		path: path.join(__dirname, 'public'),
		publicPath: '/',
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.scss$/,
				use: cssConfig
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader?name=[name].[ext]&outputPath=/assets/images/&publicPath=/',
					'image-webpack-loader?bypassOnDebug' // Optimize image size
				]
			},
			// Bootstrap 4
			{
				// eslint-disable-next-line no-useless-escape
				test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/,
				loader: 'imports-loader?jQuery=jquery'
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'src'),
		compress: true,
		port: 9000,
		host: '0.0.0.0',
		stats: 'errors-only',
		hot: true // Hot module replacement
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			chunks: ['app', 'home', 'bootstrap'],
			hash: true,
			minify: {
				collapseWhitespace: false
			}
		}),
		new HtmlWebpackPlugin({
			filename: 'dashboard.html',
			template: './src/dashboard.html',
			chunks: ['app', 'bootstrap'],
			hash: true,
			minify: {
				collapseWhitespace: false
			}
		}),
		new HtmlWebpackPlugin({
			filename: '404.html',
			template: './src/404.html',
			chunks: ['bootstrap'],
			hash: true,
			minify: {
				collapseWhitespace: false
			}
		}),
		new ExtractTextPlugin({
			filename: '[name].[hash].css',
			disable: !isProduction,
			allChunks: true
		}),
		// Required by Bootstrap
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			Tether: 'tether',
			'window.Tether': 'tether',
			Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
			Button: 'exports-loader?Button!bootstrap/js/dist/button',
			Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
			Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
			Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
			Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
			Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
			Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
			Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
			Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
			Util: 'exports-loader?Util!bootstrap/js/dist/util'
		}),
		// new FaviconsWebpackPlugin({
		// 	logo: path.join(__dirname, 'src', 'assets', 'images', 'webpack.png'),
		// 	prefix: 'assets/icons/',
		// 	emitStats: false,
		// 	statsFilename: 'assets/iconstats.json',
		// 	persistentCache: true,
		// 	inject: true,
		// 	background: '#fff',
		// 	title: 'Change me in webpack config',
		// 	icons: {
		// 		android: true,
		// 		appleIcon: true,
		// 		appleStartup: false,
		// 		coast: false,
		// 		favicons: true,
		// 		firefox: true,
		// 		opengraph: false,
		// 		twitter: false,
		// 		yandex: false,
		// 		windows: false
		// 	}
		// }),
		// Enable Hot module replacement
		new webpack.HotModuleReplacementPlugin(),
		// Prints more readable module names in the browser
		new webpack.NamedModulesPlugin(),
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, 'src/*.html'))
		})
	]
};
