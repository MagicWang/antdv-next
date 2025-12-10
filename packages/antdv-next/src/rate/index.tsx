import type { RateProps as VcRateProps } from '@v-c/rate'
import type { TooltipProps } from '../tooltip'
import { StarFilled } from '@antdv-next/icons'
import { defineComponent } from 'vue'

function isTooltipProps(item: TooltipProps | string): item is TooltipProps {
  return typeof item === 'object' && item !== null
}

const defaults = {
  size: 'middle',
  character: <StarFilled />,
} as any
export interface RateProps extends Omit<
  VcRateProps,
'onChange' | 'onHoverChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onMouseLeave' | 'onUpdate:value'
> {
  rootClass?: string
  size?: 'small' | 'middle' | 'large'
  tooltips?: (TooltipProps | string)[]
}

export interface RateEmits {
  'update:value': (value: number) => void
  'change': (value: number) => void
  'hoverChange': (value: number) => void
  'focus': () => void
  'blur': () => void
  'keydown': (e: KeyboardEvent) => void
  'mouseleave': (e: FocusEvent) => void
}

const Rate = defineComponent<RateProps>(
  (props = defaults, { slots, attrs, emit, expose }) => {
    return () => {
      return null
    }
  },
  {
    name: 'ARate',
    inheritAttrs: false,
  },
)

export default Rate
