import type { FontIconOptions, Options, SvgIconOptions } from './types';

import http from 'http';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { name } from '../package.json';

export const PKG_NAME = name;
export const DEFAULT_ICON_NAME = 'KIcon';
export const VIRTUAL_MODULE_IDS = ['virtual:generated-icons', '~generated-icons'];
export let VIRTUAL_MODULE_ID = VIRTUAL_MODULE_IDS[0];
export const VIRTUAL_MODULE_PATH = '/@vite-iconfont-plugin/generated-icons.ts';

export function setVirtualModuleId(id: string) {
  VIRTUAL_MODULE_ID = id;
}

export function ensureArray<T>(arr: T | T[]): T[] {
  return Array.isArray(arr) ? arr : [arr];
}

export function fetchScript(scriptUrl: string): Promise<string> {
  const url = scriptUrl.startsWith('http') ? scriptUrl : 'http:' + scriptUrl;
  const resultData: string[] = [];
  return new Promise<string>((resolve, reject) => {
    http.get(url).on('response', (response) => {
      response
        .on('data', (data) => resultData.push(data.toString('utf-8')))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(resultData.join('')));
    });
  });
}

export function getDtsFilePath(options: Options) {
  if (typeof options.dts === 'string') {
    return options.dts.startsWith('/') ? options.dts : resolve(options.dts);
  } else {
    return resolve('iconfont.d.ts');
  }
}

export async function fetchRemoteResources(
  urls: (string | undefined)[]
): Promise<string[]> {
  const contents = await Promise.all(
    urls.map(async (url) => {
      if (!url) return '';
      try {
        return fetchScript(url);
      } catch (error: unknown) {
        console.error('[unik-iconfont]: 加载 iconfont 资源失败, ', error);
        return '';
      }
    })
  );

  return contents.filter(Boolean);
}

export async function generateDTSCode(
  options: Options,
  template: string,
  extract: (content: string) => string[]
) {
  const urls = [
    (options as SvgIconOptions).scriptUrls,
    (options as FontIconOptions).styleUrls,
  ].flat();

  const contents = await fetchRemoteResources(urls);
  const icons = contents.flatMap((content) => extract(content));
  const code = template
    .replace('#{module}', VIRTUAL_MODULE_ID)
    .replace('#{name}', options.name ?? DEFAULT_ICON_NAME)
    .replace('#{icons}', icons.map((n) => `'${n}'`).join(' | '));

  let dtsPath: string;
  if (typeof options.dts === 'string') {
    dtsPath = options.dts.startsWith('/') ? options.dts : resolve(options.dts);
  } else {
    dtsPath = resolve('iconfont.d.ts');
  }
  await writeFile(dtsPath, code);
}

export function extractSvgIcons(content: string): string[] {
  const regRxp = /<symbol id="([\w-]+)"/g;
  const icons: string[] = [];

  let matched: RegExpExecArray | null = null;
  while ((matched = regRxp.exec(content))) {
    icons.push(matched[1]);
  }
  return icons;
}

export function extractFontIcons(content: string): string[] {
  const regRxp = /\.([^:]+):before/g;
  const icons: string[] = [];

  let matched: RegExpExecArray | null = null;
  while ((matched = regRxp.exec(content))) {
    icons.push(matched[1]);
  }
  return icons;
}

export function duplicate(icons: string[]): string[] {
  return Array.from(new Set(icons));
}
