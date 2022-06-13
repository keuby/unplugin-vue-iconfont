export type CodeGenerator = 'svg' | 'font' | 'vant' | 'naive' | 'ant-design';

export interface IconOptions {
  /**
   * 生成 d.ts 文件
   *
   * - boolean 表示是否生成，若为 true，则生成位置为 {rootDir}/iconfont.d.ts
   * - string 指定生成 d.ts 的路径
   */
  dts?: boolean | string;
  /**
   * 使用时的组件名称，例如 <k-icon type="delete" />
   *
   * @default 'KIcon'
   */
  name?: string;
}

export interface FontIconOptions extends IconOptions {
  type: 'vant' | 'font';
  /**
   *  样式文件路径，由 iconfont 生成，可以指定多个 iconfont 项目的样式文件，参考 [font-class 引用](https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.20&helptype=code)
   */
  styleUrls?: string | string[];
  /**
   * 指定 icon 元素额外的样式属性，例如默认字体大小等
   */
  extraStyles?: Record<string, string>;
}

export interface SvgIconOptions extends IconOptions {
  type: 'ant-design' | 'naive' | 'svg';
  /**
   * 脚本文件路径，由 iconfont 生成，可以指定多个 iconfont 项目的脚本文件，参考 [symbol 引用](https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.20&helptype=code)
   */
  scriptUrls?: string | string[];
  /**
   * svg 元素的额外属性，例如 width，height, viewBox 等
   */
  extraProps?: Record<string, string>;
}

export type Options = FontIconOptions | SvgIconOptions;
