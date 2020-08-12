const glob = require('glob');
const path = require('path');

module.exports = {
    watch: false,
    mode: 'production',
    devServer: {
       
    },
    entry: glob.sync('./unminified/js/*.*(js|jsx)').reduce((acc, item) => {

        const accumulator = acc;

        accumulator[item.replace(/unminified\/js\//g, '').replace(/.jsx/g, '.js')] = item;

        return accumulator;

    }, {}),

    output: {
       
        filename: '[name]',
        path: path.resolve(__dirname, './js'),
    },
    optimization: {
        minimize: true,
    },
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,

                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    
                    }
                    
                }
            }
        ]
    },
    watchOptions: {
        ignored: './node_modules/'
    },
    
    resolve: {
        extensions: ['.js', '.jsx']
    },
};
