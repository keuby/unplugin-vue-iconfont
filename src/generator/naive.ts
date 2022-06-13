import type { SvgIconOptions } from '../types';

import { PKG_NAME, DEFAULT_ICON_NAME, extractSvgIcons, generateDTSCode } from '../utils';

const templateCode = `
import { defineComponent, h, withCtx, computed } from 'vue'
import { NIcon as NaiveIcon } from 'naive-ui'
import { createSvgIcon } from '${PKG_NAME}/iconfont'

const SvgIcon = createSvgIcon({
  scriptUrl: #{scriptUrl},
  extraProps: #{extraProps},
})

export const #{name} = defineComponent({
  name: 'Icon',
  props: {
    name: String,
  },
  setup(props, { slots }) {
    const defaultSlots = {
      default: withCtx(() => h(SvgIcon, { name: props.name })),
    }
    return () => {
      return h(NaiveIcon, null, props.name ? defaultSlots : slots);
    };
  },
})
`.trim();

const templateDts = `
declare module '#{module}' {
  import { IconProps } from 'naive-ui';

  export type IconFontName = #{icons};

  export interface IconFontProps extends IconProps {
    name: IconFontName;
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
      return templateCode
        .replace('#{name}', options.name ?? DEFAULT_ICON_NAME)
        .replace('#{scriptUrl}', JSON.stringify(options.scriptUrls))
        .replace('#{extraProps}', JSON.stringify(options.extraProps));
    },
  };
}
