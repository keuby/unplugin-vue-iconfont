import type { FontIconOptions } from '../types';

import {
  PKG_NAME,
  DEFAULT_ICON_NAME,
  ensureArray,
  extractFontIcons,
  generateDTSCode,
} from '../utils';

const templateCode = `
import 'vant/es/icon/style/index';
import { Icon as VanIcon } from 'vant';
import { defineComponent, h } from 'vue';
import { createStyleElement, iconfontProps } from '${PKG_NAME}/iconfont';

createStyleElement({
  styleUrls: #{styleUrls},
  className: 'van-icon-iconfont',
  extraStyles: #{extraStyles},
})

export const #{name} = defineComponent({
  name: 'Icon',
  props: iconfontProps,
  setup(props) {
    return () => h(VanIcon, {
      name: 'iconfont',
      class: props.name,
    })
  }
})
`.trim();

const templateDts = `
declare module '#{module}' {
  import { IconProps } from 'vant';
  import { FunctionalComponent } from 'vue';

  export type IconFontName = #{icons};

  export interface IconFontProps extends Partial<Omit<IconProps, 'name' | 'classPrefix'>> {
    name: IconFontName;
  }

  export const #{name}: FunctionalComponent<IconFontProps>;
}
`.trim();

export default function createGenerator(options: FontIconOptions) {
  let generated = false;

  return {
    async generateDTS(): Promise<void> {
      if (!options.dts || generated) return;
      generated = true;
      return generateDTSCode(options, templateDts, extractFontIcons);
    },
    generateCode(): string {
      const styleUrls = ensureArray(options.styleUrls);
      return templateCode
        .replace('#{name}', options.name ?? DEFAULT_ICON_NAME)
        .replace('#{styleUrls}', JSON.stringify(styleUrls))
        .replace('#{extraStyles}', JSON.stringify(options.extraStyles));
    },
  };
}
