'use strict';

import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const DashboardPlugin = require('webpack-dashboard/plugin');
const PATH = (str) => path.resolve(__dirname, str);

let config;

const common = {
	cache: true,
	context: __dirname,
	entry: {
		head: PATH('js/head/index.js'),
		index: [
			PATH('css/style.less'),
			PATH('js/index.js')
		]
	},
	output: {
		path: PATH('dist'),
		filename: 'bundle-[name].js',
		chunkFilename: '[name].js',
		sourceMapFilename: '[file].map',
		publicPath: '/dist/'
	},
	performance: {
		maxAssetSize: 250000,
		maxEntrypointSize: 250000
	},
	devServer: {
		// add contentBase if you need to handle a subdomain.
		// For example for example.co/win/ simply add
		// contentBase: '/win/' to serve the content
		// from there.
		// display errors in a webpage overlay
		overlay: true,
		// gzip everything produced by Webpack
		compress: true,
		// serve over https
		// https: true,
		// allow Cross Origin Request
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	},
	module: {
		loaders: [
			{
				test: /\.js$|\.json$|\.jsx$/,
				use: 'babel-loader',
				include: PATH('js'),
				exclude: /node_modules/
			},
			{
				test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: 'url-loader'
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								plugins: (loader) => [
									require('autoprefixer')(
                                        { browsers: ['last 2 versions'] }
                                    )
								]
							}
						},
						{
							loader: 'less-loader',
							options: {
								sourceMap: true
							}
						}
					]
				}),
				exclude: /node_modules/
			},
			{
				test: /\.(ss|svg)$/,
				loader: 'babel-loader!svg-react-loader'
			}
		]
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'bundle-style.css',
			disable: false,
			allChunks: true
		}),
		new CleanWebpackPlugin('build', {
			root: process.cwd()
		}),
		new DashboardPlugin()
	]
};

const productionPlugins = [
	new webpack.DefinePlugin({
		'process.env': { 'NODE_ENV': JSON.stringify('production') }
	}
    ),
	new webpack.LoaderOptionsPlugin({
		minimize: true,
		debug: false
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: ['vendor', 'head']
	}),
	new webpack.optimize.UglifyJsPlugin({
		output: {
			comments: false
		},
		compress: {
			drop_console: true,
			warnings: false
		},
		sourceMap: false
	}),
	new webpack.optimize.ModuleConcatenationPlugin(),
	new BundleAnalyzerPlugin()
];

switch (process.env.npm_lifecycle_event) {
	case 'prod':
		config = merge(common, {
			module: {
				loaders: [
					{
						test: /\.js$|\.json$|\.jsx$/,
						enforce: 'pre',
						loader: 'eslint-loader',
						include: PATH('js'),
						exclude: [/node_modules/, PATH('js/head')],
						options: {
							fix: true
						}
					}
				]
			},
			plugins: productionPlugins
		});
		break;
	default:
		config = merge(common, {
			entry: {
				vendor: [
					'react',
					'react-dom',
					'barba.js'
				]
			},
			plugins: [
				new webpack.optimize.CommonsChunkPlugin({
					name: ['vendor', 'head']
				})
			],
			devtool: 'source-map'
		});
}

export default config;
