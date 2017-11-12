var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var extractPlugin = new ExtractTextPlugin({
    filename: 'main.css'
});

module.exports = {
    entry: {
        app: './src/app/app.module.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
        // publicPath: '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['ng-annotate-loader']
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                ],
                exclude: [/node-modules/]
            },
            {
                test: /\.css$/,
                use: extractPlugin.extract({
                    use: ['css-loader']
                })
            },
            {
                test: /index.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'templates/'
                        }
                    }
                ],
                exclude: [
                    path.resolve(__dirname, 'src/index.html'),
                    /node-modules/
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            Immutable: 'immutable'
            // $: 'jquery',
            // jQuery: 'jquery',
            // "window.jQuery": "jquery"
        }),
        extractPlugin,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new BundleTracker({filename: './webpack-stats.json'}),
        new CleanWebpackPlugin(['dist'])
    ],
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    devtool: 'source-map'
};