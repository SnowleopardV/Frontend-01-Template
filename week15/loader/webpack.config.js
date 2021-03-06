const path = require('path');
module.exports = {
    entry: "./index.js",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.view$/,
                use: {
                    loader: path.resolve('./myloader.js')
                }
            }
        ]
    },
    mode: "development",
    node: {

        fs: 'empty',

        net:'empty',

        tls:"empty",

   }
}