const { resolve } = require('path');
const merge = require('deepmerge');
const { defineConfig } = require('rollup');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const esbuild = require('rollup-plugin-esbuild').default;

const extensions = ['.mjs', '.js', '.json', '.ts'];

const baseConfig = defineConfig({
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
    format: 'umd',
    exports: 'named',
    globals: {
      vue: 'Vue',
    },
  },
});

const KIconfont = defineConfig({
  input: resolve('./src/iconfont.ts'),
  output: {
    name: 'KIconfont',
    file: resolve('dist/iconfont.global.js'),
  },
});

const NaiveUI = defineConfig({
  input: resolve('./src/icons/naive.ts'),
  external: ['naive-ui'],
  output: {
    name: 'KIconfont',
    file: resolve('dist/iconfont-naive.global.js'),
    globals: {
      'naive-ui': 'naive',
    },
  },
});

module.exports = [merge(baseConfig, KIconfont), merge(baseConfig, NaiveUI)];
