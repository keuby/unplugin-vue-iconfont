# unplugin-vue-iconfont

基于 Vue 的 [iconfont.cn](https://www.iconfont.cn/) 封装，支持 vite、webpack

## 特性

- 只需要填入 iconfont url，就可以自动从 iconfont.cn 导入图标
- 支持和开源组件库直接集成，使用 `k-icon` 会自动编译为对应 UI 框架的 icon 组件
- 支持直接和 unplugin-vue-components 插件一起使用 (推荐)
- 自动生成 dts 文件，图标名称支持 ts 类型提示

  ![demo](http://bucket.keuby.com/demo.png)

## 如何使用

安装 unplugin-vue-iconfont

```bash
npm install unplugin-vue-iconfont --save-dev
```

基于 vite

```ts
import path from 'path';
import { defineConfig } from 'vite';
import Iconfont from 'unplugin-vue-iconfont/vite';

export default defineConfig({
  plugins: [
    Iconfont({
      dts: true,
      type: 'svg',
      scriptUrls: ['//at.alicdn.com/t/font_3151940_2yxtpj63qfk.js'],
    }),
  ],
});
```

基于 webpack

```ts
const Iconfont = require('unplugin-vue-iconfont/webpack');

module.export = {
  plugins: [
    new Iconfont({
      dts: true,
      type: 'svg',
      scriptUrls: ['//at.alicdn.com/t/font_3151940_2yxtpj63qfk.js'],
    }),
  ],
};
```

和 unplugin-vue-components 集成

```ts
import path from 'path';
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
```

## 开源组件支持

现目前支持开源 UI 组件库为

- vant
- ant design vue
- naive-ui
