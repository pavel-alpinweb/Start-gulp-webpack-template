const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    entry: {
        about: './src/assets/scripts/about.js',
        auth: './src/assets/scripts/auth.js',
        works: './src/assets/scripts/works.js',
        blog: './src/assets/scripts/blog.js'
    },
    output: {
        filename: '[name].bundle.js'
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
};

module.exports = config;