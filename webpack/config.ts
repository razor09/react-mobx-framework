import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin, { loader } from 'mini-css-extract-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin } from 'webpack'
import { Args } from './typings'
import { entry, getBaseUrl, getDevServer, getIsDevelopment, getIsMocksOn, getIsProduction, dist as path } from './utils'

export default (_: never, args: Args): Configuration => {
  const isDevelopment = getIsDevelopment(args)
  const isProduction = getIsProduction(args)
  const isMocksOn = getIsMocksOn(args)
  const devServer = getDevServer(args)
  const baseUrl = getBaseUrl(args)
  return {
    entry,
    output: {
      path,
      filename: '[fullhash].js',
      clean: true,
    },
    performance: {
      hints: false,
    },
    stats: 'errors-warnings',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new CssMinimizerWebpackPlugin(),
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? 'style-loader' : loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDevelopment ? '[local]-[hash:base64:10]' : '[hash:base64:10]',
                  namedExport: false,
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(ttf|png)$/,
          type: 'asset/resource',
          generator: {
            filename: '[hash].[ext]',
          },
        },
      ],
    },
    devtool: isDevelopment && 'source-map',
    devServer,
    plugins: [
      new DefinePlugin({ isMocksOn, baseUrl }),
      new MiniCssExtractPlugin({
        filename: '[fullhash].css',
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        favicon: 'public/favicon.ico',
      }),
    ],
  }
}
