import type { Options } from './types';

import unplugin from '.';

export class IconfontWebpackPlugin {
  private plugin: any;
  constructor(options: Options) {
    this.plugin = unplugin.webpack(options);
  }

  apply(compiler: any) {
    return this.plugin.apply(compiler);
  }
}

export default IconfontWebpackPlugin;
