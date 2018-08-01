import {compile, dist, babel} from './../../rollup.builder';

const name = 'core';
const js = `HeroAnimation.${name}`;
const npm = `@hero-animation/${name}`;

module.exports = [
  compile({
    namespace: {js, npm},
    plugins: [babel],
    output: [
      {format: 'umd', file: dist(name, `bundles/${name}.umd.js`)},
      {format: 'esm', file: dist(name, `esm5/${name}.js`)},
    ]
  }),
  compile({
    namespace: {js, npm},
    output: [
      {format: 'esm', file: dist(name, `esm2015/${name}.js`)},
    ]
  }),
];