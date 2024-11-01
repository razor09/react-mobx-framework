import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { resolve } from 'path'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { Configuration, DefinePlugin } from 'webpack'
import 'webpack-dev-server'
import { getBaseUrl, getIsDevelopment, getIsMocksOn, getIsProduction, getProxy, host, port } from './settings'
import { Args } from './typings'

export default (_: object, args: Args): Configuration => {
  const isDevelopment = getIsDevelopment(args)
  const isProduction = getIsProduction(args)
  const isMocksOn = getIsMocksOn(args)
  const baseUrl = getBaseUrl(args)
  const proxy = getProxy(args)
  return {
    entry: resolve('src/entry'),
    output: {
      path: resolve('dist'),
      publicPath: '/',
      filename: '[fullhash].js',
      clean: true,
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
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDevelopment ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:6]',
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
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
      host,
      port,
      proxy,
      historyApiFallback: true,
    },
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
