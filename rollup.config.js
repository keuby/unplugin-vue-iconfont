const { resolve } = require('path');
const { defineConfig } = require('rollup');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const esbuild = require('rollup-plugin-esbuild').default;

const extensions = ['.mjs', '.js', '.json', '.ts'];

module.exports = defineConfig({
  input: resolve('./src/iconfont.ts'),
  plugins: [
    json(),
    commonjs(),
    nodeResolve({ extensions }),
    esbuild({ target: 'esnext' }),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
    terser(),
  ],
  external: ['vue'],
  output: {
    name: 'KIconfont',
    format: 'umd',
    exports: 'named',
    globals: {
      vue: 'Vue',
    },
    file: resolve('dist/iconfont.global.js'),
  },
});
