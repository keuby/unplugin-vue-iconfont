declare module 'virtual:generated-icons' {
  import { HTMLAttributes, FunctionalComponent } from 'vue';

  export type IconFontName = 'heart-selected' | 'share';

  export interface IconFontProps extends HTMLAttributes {
    name: IconFontName;
  }

  export const KIcon: FunctionalComponent<IconFontProps>;
}