import type { SvgIconParam } from '../iconfont';
import type { SvgIconOptions } from '../types';

import { PKG_NAME, extractSvgIcons, generateDTSCode } from '../utils';

const templateCode = `
import AntDesignIcon from '@ant-design/icons-vue';
import { defineComponent, h } from 'vue';
import { createSvgIcon } from '${PKG_NAME}/iconfont';
IconComponentProps
const SvgIcon = createSvgIcon({
  scriptUrl: #{scriptUrl},
  extraProps: #{extraProps},
})

export const #{name} = defineComponent({
  name: 'Icon',
  props: {
    name: String,
  },
  render() {
    return h(AntDesignIcon, {
      component: h(SvgIcon, { name: this.name })
    })
  }
})
`.trim();

const templateDts = `
declare module '#{module}' {
  import { HTMLAttributes, FunctionalComponent } from 'vue';

  export type IconFontName = #{icons};

  export interface IconFontProps extends HTMLAttributes {
    name: IconFontName;
    spin?: boolean;
    rotate?: number;
  }

  export const #{name}: FunctionalComponent<IconFontProps>;
}
`.trim();

export default function createGenerator(options: SvgIconOptions) {
  let generated = false;

  return {
    async generateDTS(): Promise<void> {
      if (!options.dts || generated) return;

      generated = true;
      return generateDTSCode(options, templateDts, extractSvgIcons);
    },
    generateCode(): string {
      const params: SvgIconParam = {};
      params.scriptUrl = options.scriptUrls;
      params.extraProps = options.extraProps ?? {};

      return templateCode
        .replace('#{name}', options.name ?? 'KIcon')
        .replace('#{scriptUrl}', JSON.stringify(options.scriptUrls))
        .replace('#{extraProps}', JSON.stringify(options.extraProps));
    },
  };
}
