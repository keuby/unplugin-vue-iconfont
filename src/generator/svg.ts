import type { SvgIconOptions } from '../types';
import type { SvgIconParam } from '../iconfont';

import { PKG_NAME, DEFAULT_ICON_NAME, extractSvgIcons, generateDTSCode } from '../utils';

const templateCode = `
import { createSvgIcon } from '${PKG_NAME}/iconfont';

export const #{name} = createSvgIcon({
  scriptUrl: #{scriptUrl},
  extraProps: #{extraProps},
})
`.trim();

const templateDts = `
declare module '#{module}' {
  import { HTMLAttributes, FunctionalComponent } from 'vue';

  export type IconFontName = #{icons};

  export interface IconFontProps extends HTMLAttributes {
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
      const params: SvgIconParam = {};
      params.scriptUrl = options.scriptUrls;
      params.extraProps = options.extraProps ?? {};

      return templateCode
        .replace('#{name}', options.name ?? DEFAULT_ICON_NAME)
        .replace('#{scriptUrl}', JSON.stringify(options.scriptUrls))
        .replace('#{extraProps}', JSON.stringify(options.extraProps));
    },
  };
}
