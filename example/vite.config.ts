import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { IconResolver } from 'unplugin-vue-iconfont';
import Iconfont from 'unplugin-vue-iconfont/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  plugins: [
    Vue(),
    Iconfont({
      dts: true,
      type: 'svg',
      scriptUrls: ['//at.alicdn.com/t/font_3151940_2yxtpj63qfk.js'],
    }),
    Components({
      dts: true,
      resolvers: [IconResolver()],
    }),
  ],
});
