var path = require('path');

var webpack = require('webpack');

var vue = require("vue-loader");

//混淆压缩
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

//检测重用模块
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

//独立样式文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//AppCache模块
var AppCachePlugin = require("appcache-webpack-plugin");


var plugins = [
    //会将所有的样式文件打包成一个单独的style.css
    new ExtractTextPlugin("style.css", {
        disable: false//,
        //allChunks: true  //所有独立样式打包成一个css文件
    }),
    //new ExtractTextPlugin("[name].css" )
    //自动分析重用的模块并且打包成单独的文件
    new CommonsChunkPlugin("vendor.js"),

    /* new AppCachePlugin({
     cache: ['someOtherAsset.jpg'],
     network: null,  // No network access allowed!
     fallback: ['failwhale.jpg'],
     settings: ['prefer-online'],
     exclude: ['file.txt', /.*\.js$/],  // Exclude file.txt and all .js files
     output: 'my-manifest.appcache'
     })*/

];


module.exports = {
    entry: ["./src/app.js"],
    output: {
        path: path.resolve('build'),
        /*
         publicPath路径就是你发布之后的路径，
         比如你想发布到你站点的/util/vue/build 目录下, 那么设置
         publicPath: "/pub/build/",
         此字段配置如果不正确，发布后资源定位不对，比如：css里面的精灵图路径错误
         */
        publicPath: "/build/",
        filename: "build.js"//"build.[hash].js"//[hash]MD5戳   解决html的资源的定位可以使用 webpack提供的HtmlWebpackPlugin插件来解决这个问题  见：http://segmentfault.com/a/1190000003499526 资源路径切换
    },
    module: {
        preLoaders: [
            // {
            //     //代码检查
            //     test:/\.js$/,exclude:/node_modules/,loader:'jshint-loader'
            // }
        ],
        loaders: [
            // 加载vue组件，并将css全部整合到一个style.css里面
            // 但是使用这种方式后 原先可以在vue组件中 在style里面加入 scoped 就不能用了,
            // 好处是使用了cssnext，那么样式按照标准的来写就行了，会自动生成兼容代码 http://cssnext.io/playground/
            {test: /\.vue$/, loader: "vue-loader"},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")},
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'}, // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            {test: /\.woff$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf$/, loader: "file"},
            {test: /\.eot$/, loader: "file"},
            {test: /\.svg$/, loader: "file"}
        ]
    },
    plugins: plugins,
    devtool: 'source-map',
    resolve: {
        alias: {
            pathconf: "./config/dev/pathconf.js",
            apiconf: "./config/dev/apiconf.js"
        }
        //     // 现在可以写 require('file') 代替 require('file.coffee')
        //     extensions: ['', '.js', '.json', '.coffee','vue']
    }
};


