import type { UnpluginOptions } from 'unplugin';
import type { Options } from './types';

import { createUnplugin } from 'unplugin';
import { createGenerator } from './generator';
import {
  DEFAULT_ICON_NAME,
  VIRTUAL_MODULE_IDS,
  setVirtualModuleId,
  VIRTUAL_MODULE_ID,
  VIRTUAL_MODULE_PATH,
} from './utils';

export default createUnplugin<Options>((options) => {
  let inWebpack = false;
  const g = createGenerator(options);

  const instance: UnpluginOptions = {
    name: 'unik-iconfont',
  };

  if (g != null) {
    instance.resolveId = function (id) {
      if (VIRTUAL_MODULE_IDS.includes(id)) {
        if (inWebpack) {
          setVirtualModuleId(id);
          return id;
        } else {
          return VIRTUAL_MODULE_PATH;
        }
      }
    };

    if ('generateCode' in g) {
      instance.load = function (id) {
        if (id === VIRTUAL_MODULE_PATH || VIRTUAL_MODULE_IDS.includes(id)) {
          g.generateDTS();
          return { code: g.generateCode() };
        }
      };
    }
  }

  return {
    ...instance,
    webpack: () => {
      inWebpack = true;
      setVirtualModuleId(VIRTUAL_MODULE_IDS[1]);
    },
  };
});

export function IconResolver(name = DEFAULT_ICON_NAME) {
  return {
    type: 'component' as const,
    resolve: (importName: string) => {
      if (importName === name) {
        return { name, from: VIRTUAL_MODULE_ID };
      }
    },
  };
}
