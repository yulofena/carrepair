var path = require('path');
module.exports = {
  entry: './config/index.js',
  output: {
    path: path.join(__dirname,'./dist'),
    filename: 'vue-toast-demo.js'
  },
  module: {
    rules: [
      {
        test:/\.vue$/,
        loader:'vue-loader',
        exclude:/node_modules/,
        options:{
          loaders:{
            scss:'style-loader!css-loader!sass-loader'
          }
        }
      },{
        test:/\.js$/,
        loader: 'babel-loader',
        include:path.join(__dirname,'src'),
        exclude:/node_modules/
      }
    ]
  },
  plugins:[

  ]
}
