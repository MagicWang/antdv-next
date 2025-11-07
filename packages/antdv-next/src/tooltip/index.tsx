import type { placements as Placements } from '@v-c/tooltip'
import type { ActionType, AlignType } from '@v-c/trigger'
import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, SlotsType } from 'vue'
import type { PresetColorType } from '../_util/colors.ts'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { AdjustOverflow } from '../_util/placements.ts'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import VcTooltip from '@v-c/tooltip'
import { UniqueProvider } from '@v-c/trigger'
import { clsx } from '@v-c/util'
import { computed, defineComponent, shallowRef, watchEffect } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator.tsx'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { useZIndex } from '../_util/hooks/useZIndex.ts'
import getPlacements from '../_util/placements.ts'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { useToken } from '../theme/internal.ts'
import useMergedArrow from './hooks/useMergedArrow.ts'
import useStyle from './style'
import { parseColor } from './util.ts'

export interface TooltipRef {
  /** @deprecated Please use `forceAlign` instead */
  forcePopupAlign: VoidFunction
  forceAlign: VoidFunction
  /** Wrapped dom element. Not promise valid if child not support ref */
  nativeElement: HTMLElement
  /** Popup dom element */
  popupElement: HTMLDivElement
}

export type TooltipPlacement
  = | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'

// https://github.com/react-component/tooltip
// https://github.com/yiminghe/dom-align
export interface TooltipAlignConfig {
  points?: [string, string]
  offset?: [number | string, number | string]
  targetOffset?: [number | string, number | string]
  overflow?: { adjustX: boolean, adjustY: boolean }
  useCssRight?: boolean
  useCssBottom?: boolean
  useCssTransform?: boolean
}

export type SemanticName = 'root' | 'container' | 'arrow'

export type TooltipClassNamesType = SemanticClassNamesType<TooltipProps, SemanticName>

export type TooltipStylesType = SemanticStylesType<TooltipProps, SemanticName>

export interface TriggerCommonApi extends ComponentBaseProps {
  align?: AlignType
  arrow?: boolean | { pointAtCenter?: boolean }
  autoAdjustOverflow?: boolean | AdjustOverflow
  color?: LiteralUnion<PresetColorType>
  open?: boolean
  defaultOpen?: boolean
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  destroyOnHidden?: boolean
  zIndex?: number
  placement?: TooltipPlacement
  trigger?: ActionType | ActionType[]
  fresh?: boolean
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
  classes?: TooltipClassNamesType
  styles?: TooltipStylesType
}

export interface TooltipProps extends TriggerCommonApi {
  afterOpenChange?: (open: boolean) => void
  builtinPlacements?: typeof Placements
  title?: VueNode
  overlay?: VueNode
  openClass?: string
}

export interface TooltipEmits {
  openChange: (open: boolean) => void
  [key: string]: (...args: any[]) => void
}

export interface TooltipSlots {
  title: () => VueNode
}

/**
 * @internal
 * Internal props type with hidden properties
 */
interface InternalTooltipProps extends TooltipProps {
  'data-popover-inject'?: boolean
}

const defaults = {
  autoAdjustOverflow: true,
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
} as any
const InternalTooltip = defineComponent<
  InternalTooltipProps,
  TooltipEmits,
  string,
  SlotsType<TooltipSlots>
>(
  (props = defaults, { slots, attrs, expose, emit }) => {
    const [,token] = useToken()
    const {
      getPrefixCls,
      prefixCls,
      direction,
      arrow: contextArrow,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('tooltip', props, ['arrow'])
    const {
      arrow: tooltipArrow,
      builtinPlacements,
      autoAdjustOverflow,
      classes,
      styles,
    } = toPropsRefs(props, 'arrow', 'builtinPlacements', 'autoAdjustOverflow', 'classes', 'styles')
    const mergedArrow = useMergedArrow(tooltipArrow, contextArrow)
    const mergedShowArrow = computed(() => mergedArrow.value?.show)
    // ============================== Ref ===============================
    const tooltipRef = shallowRef()
    const forceAlign = () => {
      tooltipRef.value?.forceAlign?.()
    }

    expose({
      forceAlign,
      nativeElement: computed(() => tooltipRef.value?.nativeElement),
      popupElement: computed(() => tooltipRef.value?.popupElement),
    })

    // ============================== Open ==============================
    const open = shallowRef(props?.defaultOpen ?? false)
    watchEffect(() => {
      if (props.open !== undefined) {
        open.value = props.open
      }
    })
    let noTitle = false
    const onInternalOpenChange = (vis: boolean) => {
      open.value = noTitle ? false : vis
      if (!noTitle) {
        emit('openChange', vis)
      }
    }

    const tooltipPlacements = computed(() => {
      return (
        builtinPlacements.value
        || getPlacements({
          arrowPointAtCenter: mergedArrow?.value?.pointAtCenter ?? false,
          autoAdjustOverflow: autoAdjustOverflow.value,
          arrowWidth: mergedShowArrow ? token.value.sizePopupArrow : 0,
          borderRadius: token.value.borderRadius,
          offset: token.value.marginXXS,
          visibleFirst: true,
        })
      )
    })

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return props
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TooltipClassNamesType,
      TooltipStylesType,
      TooltipProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))
    const rootPrefixCls = computed(() => getPrefixCls())

    const injectFromPopover = props['data-popover-inject']

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls, !injectFromPopover)

    // ============================ zIndex ============================
    const [zIndex, contextZIndex] = useZIndex('Tooltip', computed(() => props.zIndex))
    return () => {
      const { color, rootClass } = props
      const title = getSlotPropsFnRun(slots, props, 'title')
      const overlay = getSlotPropsFnRun(slots, props, 'overlay')
      noTitle = !title && !overlay && title !== 0 // overlay for old version compatibility
      const memoOverlay = title === 0 ? title : (overlay || title || '')
      const memoOverlayWrapper = (
        <ContextIsolator space>{memoOverlay}</ContextIsolator>
      )

      // Color
      const colorInfo = parseColor(prefixCls.value, color)
      const arrowContentStyle = colorInfo.arrowStyle
      const themeCls = clsx(rootCls.value, hashId.value, cssVarCls.value)
      const rootClassNames = clsx(
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
        colorInfo.className,
        rootClass,
        themeCls,
        contextClassName.value,
        mergedClassNames.value.root,
      )
      const containerStyle = [mergedStyles.value.container, colorInfo.overlayStyle]
      const content = (
        <VcTooltip></VcTooltip>
      )
      return null
    }
  },
  {
    name: 'ATooltip',
    inheritAttrs: false,
  },
)

;(InternalTooltip as any).install = (app: App) => {
  app.component(InternalTooltip.name, InternalTooltip)
  app.component('AUniqueProvider', UniqueProvider)
}

;(InternalTooltip as any).UniqueProvider = UniqueProvider

export {
  UniqueProvider,
}

export default InternalTooltip as typeof InternalTooltip & {
  UniqueProvider: typeof UniqueProvider
}
