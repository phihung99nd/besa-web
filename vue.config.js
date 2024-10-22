const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const resolve = dir => {
  return path.join(__dirname, dir);
};
const configs = require('./src/config')
const shortHash = require('short-hash');
/**
 * During project development, judge the production environment and the development environment
 * Use CDN to optimize the path in the production environment
 * Replace the development environment with local content, which is convenient for handling bugs and opening vue Dev
 * We can perform corresponding processing according to the environment variables, and only let the plug-in automatically inject the corresponding resource files into the html page when it is in production
 */
const enableProduction = process.env.NODE_ENV === "production"; // whether the production environment
console.log(process.env.NODE_ENV)
// delete comment
let jsPlugin = [
  new UglifyJsPlugin({
    uglifyOptions: {
      // delete comment
      output: {
        comments: false
      },
      compress: {
        drop_console: true, // delete all debuggers with console
        drop_debugger: true,
        pure_funcs: ["console.log"] // delete console log
      }
    }
  })
];

jsPlugin = enableProduction ? jsPlugin : [];

module.exports = {
  // The output file directory, the directory of the production environment build file generated when running vue-cli-service build.
  // Note that the target directory is cleared before building
  outputDir: "dist",
  // Directory to place generated static resources (js, css, img, fonts)。
  assetsDir: "static",

  css: {
    // Whether to enable source maps for CSS. May affect build performance when set to true。
    sourceMap: false,

    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          auto: () => true,
          // localIdentName: '[hash:base64:5]',
          getLocalIdent: (context, localIdentName, localName, options) => {
            localIdentName = localIdentName.replace('[local]', localName)
            return `besa_${shortHash(localIdentName)}`;
          },
        }
      },
      sass: {
        data: `@import "@/assets/styles/global.scss";` //global loading scss
      },
      // pass options to css related loaders
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    port: configs.port,
    disableHostCheck: true,
  },

  // Do not generate a .map file when packaging to avoid seeing the source code
  productionSourceMap: false,

  // deployment optimization
  configureWebpack: {
    performance: {
      maxEntrypointSize: 10000000,
      maxAssetSize: 30000000
    },

    // gzip compression
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/, // match file
        threshold: 10240 // compression for more than 10k files
      })
    ],
    optimization: {
      minimizer: jsPlugin,
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      }
    }
  },

  // mount cdn resources to the plugin
  chainWebpack(config) {
    //  @ corresponding to the src directory
    config.resolve.alias.set("@", resolve("src"));
    config.module
      .rule('js')
      .test(/\.jsx?$/)
      .exclude
      .add(resolve('src/libs/iview-pro'))
      .end();
  }
};
