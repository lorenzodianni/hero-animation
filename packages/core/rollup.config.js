const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');

export const compile = ({namespace, plugins = [], output = []}) => {
  return {
    input: './src/index.js',
    plugins: [
      resolve(),
      commonjs(),
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

const name = 'core';
const js = `HeroAnimation.${name}`;
const npm = `@hero-animation/${name}`;

module.exports = [
  compile({
    namespace: {js, npm},
    plugins: [babel({exclude: 'node_modules/**'})],
    output: [
      {format: 'umd', file: `lib/bundles/${name}.umd.js`},
      {format: 'esm', file: `lib/esm5/${name}.js`},
    ]
  }),
  compile({
    namespace: {js, npm},
    output: [
      {format: 'esm', file: `lib/esm2015/${name}.js`},
    ]
  }),
];