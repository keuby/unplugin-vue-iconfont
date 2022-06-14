import { defineComponent, h, withCtx } from 'vue';
import { NIcon } from 'naive-ui';
import { KSvgIcon } from '../iconfont';

export const KIcon = defineComponent({
  name: 'Icon',
  props: {
    name: String,
  },
  setup(props, { slots }) {
    const defaultSlots = {
      default: withCtx(() => h(KSvgIcon, { name: props.name })),
    };
    return () => {
      return h(NIcon, null, props.name ? defaultSlots : slots);
    };
  },
});
