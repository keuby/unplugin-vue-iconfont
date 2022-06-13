import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/{index,vite,webpack,iconfont}.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  external: ['unplugin', 'vue'],
});
