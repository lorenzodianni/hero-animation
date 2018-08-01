const path = require('path');
const babelPlugin = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');

export const root = (_path) => path.join(__dirname, '../..', _path);
export const dist = (module, file) => root(`dist/packages/${module}/${file}`);
export const compile = ({namespace, plugins = [], output = []}) => {
  return {
    input: `${__dirname}/index.js`,
    plugins: [
      resolve(),
      sourcemaps(),
      ...plugins,
    ],
    output: output.reduce((acc, out) => [...acc, {
      ...out,
      exports: 'named',
      name: namespace.js,
      amd: {id: namespace.npm},
    }], [])
  }
};

export const babel = babelPlugin({
  babelrc: false,
  plugins: [root('node_modules/babel-plugin-external-helpers')],
  presets: [[root('node_modules/babel-preset-env'), {modules: false}]],
  externalHelpers: true,
  exclude: 'node_modules/**',
});