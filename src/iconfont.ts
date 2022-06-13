import type { PropType, ExtractPropTypes } from 'vue';
import { defineComponent, h } from 'vue';

const customCache = new Set<string>();
const fontFamilyReg = /font-family: ([^;]+);/;

function isValidCustomUrl(url: string): boolean {
  return typeof url === 'string' && !!url.length && !customCache.has(url);
}

function inBrowserEnv() {
  return (
    typeof document !== 'undefined' &&
    typeof window !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

async function fetchContent(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    return await res.text();
  } catch (err: unknown) {
    console.warn('[unik-iconfont]: 加载 iconfont 资源失败, ', err);
    return '';
  }
}

export function createScriptElements(scriptUrls: string[], index = 0): void {
  const currentScriptUrl = scriptUrls[index];
  if (isValidCustomUrl(currentScriptUrl) && inBrowserEnv()) {
    const script = document.createElement('script');
    script.setAttribute('src', currentScriptUrl);
    script.setAttribute('data-namespace', currentScriptUrl);
    if (scriptUrls.length > index + 1) {
      script.onload = () => {
        createScriptElements(scriptUrls, index + 1);
      };
      script.onerror = () => {
        createScriptElements(scriptUrls, index + 1);
      };
    }
    customCache.add(currentScriptUrl);
    document.body.appendChild(script);
  }
}

export async function createStyleElement(
  options: {
    styleUrls: string[];
    className?: string;
    extraStyles?: Record<string, string>;
  } = { styleUrls: [] }
): Promise<void> {
  const promises = options.styleUrls.map(fetchContent);
  const contents = (await Promise.all(promises)).filter(Boolean);

  if (contents.length === 0) return;

  const infos = contents.map((style) => {
    const matched = style.match(fontFamilyReg);
    if (!matched) {
      return {
        name: '',
        content: '',
      };
    }

    const name = matched[1];
    const reg = new RegExp(`\\.${name.replace(/"/g, '')}[^}]+}`);
    const content = style.replace(reg, '');
    return { name, content };
  });

  const fontFamily = infos
    .filter((info) => info.name)
    .map((info) => info.name)
    .join(',');
  const extraStyles = options.extraStyles
    ? Object.entries(options.extraStyles)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')
    : '';

  const iconfontClass = `.${
    options.className || 'iconfont'
  }{font-family:${fontFamily} !important;${extraStyles}}`;
  const styleContent = infos
    .map((info) => info.content)
    .concat(iconfontClass)
    .join('\n');

  const style = document.createElement('style');
  style.textContent = styleContent;
  document.head.appendChild(style);
}

export interface SvgIconParam {
  scriptUrl?: string | string[];
  extraProps?: { [key: string]: string };
}

export interface FontIconParam {
  styleUrl?: string | string[];
  extraStyles?: { [key: string]: string };
}

export const iconfontProps = {
  name: {
    type: String as PropType<string>,
    required: true,
  },
};

export type IconfontProps = ExtractPropTypes<typeof iconfontProps>;

export function createSvgIcon(param: SvgIconParam) {
  const { scriptUrl = [], extraProps = {} } = param;

  if (inBrowserEnv()) {
    if (Array.isArray(scriptUrl)) {
      createScriptElements(scriptUrl.reverse());
    } else {
      createScriptElements([scriptUrl]);
    }
  }

  const svgProps = {
    fill: 'currentColor',
    focusable: 'false',
    'aria-hidden': 'true',
    width: '1em',
    height: '1em',
    ...extraProps,
  };

  const SvgIcon = defineComponent({
    name: 'Icon',
    props: iconfontProps,
    render() {
      const { name } = this;
      return h('svg', svgProps, h('use', { 'xlink:href': `#${name}` }));
    },
  });
  return SvgIcon;
}

export function createFontIcon(param: FontIconParam) {
  const { styleUrl = [], extraStyles = {} } = param;

  const styles = {
    'font-size': '16px',
    'font-style': 'normal',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    ...extraStyles,
  };

  if (inBrowserEnv()) {
    if (Array.isArray(styleUrl)) {
      createStyleElement({ styleUrls: styleUrl, extraStyles: styles });
    } else {
      createStyleElement({ styleUrls: [styleUrl], extraStyles: styles });
    }
  }

  const FontIcon = defineComponent({
    name: 'Icon',
    props: iconfontProps,
    render() {
      const { name, $slots } = this;
      return h('i', { class: ['iconfont', name] }, $slots);
    },
  });
  return FontIcon;
}

export const KSvgIcon = createSvgIcon({});
export const KFontIcon = createFontIcon({});
