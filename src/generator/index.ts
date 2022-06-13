import type { Options } from '../types';

import generateSvgIcon from './svg';
import generateFontIcon from './font';
import generateVantIcon from './vant';
import generateNaiveIcon from './naive';
import generateAntDesignIcon from './ant-design';

export function createGenerator(options?: Options) {
  if (!options) return null;

  switch (options.type) {
    case 'svg':
      return generateSvgIcon(options);
    case 'font':
      return generateFontIcon(options);
    case 'vant':
      return generateVantIcon(options);
    case 'naive':
      return generateNaiveIcon(options);
    case 'ant-design':
      return generateAntDesignIcon(options);
    default:
      return null;
  }
}
