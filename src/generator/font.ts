import type { FontIconOptions } from '../types';

import { PKG_NAME, DEFAULT_ICON_NAME, extractFontIcons, generateDTSCode } from '../utils';

const templateCode = `
import { createFontIcon } from '${PKG_NAME}/iconfont';

export const #{name} = createFontIcon({
  styleUrl: #{styleUrls},
  extraStyles: #{extraStyles}
})
`.trim();

const templateDts = `
declare module '#{module}' {
  import { FunctionalComponent, HTMLAttributes } from 'vue';

  export type IconFontName = #{icons};

  export interface IconFontProps extends HTMLAttributes {
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
      return templateCode
        .replace('#{name}', options.name ?? DEFAULT_ICON_NAME)
        .replace('#{styleUrls}', JSON.stringify(options.styleUrls))
        .replace('#{extraStyles}', JSON.stringify(options.extraStyles));
    },
  };
}
