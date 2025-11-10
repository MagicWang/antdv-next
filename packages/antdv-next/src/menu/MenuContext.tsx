import type { InjectionKey, Ref } from 'vue'
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks'
import type { DirectionType } from '../config-provider/context'
import type { SemanticName, SubMenuSemanticName } from './menu'
import { computed, defineComponent, inject, provide, ref } from 'vue'

export type MenuTheme = 'light' | 'dark'

export interface MenuContextProps {
  prefixCls: string
  inlineCollapsed: boolean
  direction?: DirectionType
  theme?: MenuTheme
  firstLevel: boolean
  /** @internal Safe to remove */
  disableMenuItemTitleTooltip?: boolean
  classes: SemanticClassNames<SemanticName> & {
    popup: SemanticClassNames<'root'>
    subMenu: SemanticClassNames<SubMenuSemanticName>
  }
  styles: SemanticStyles<SemanticName> & {
    popup: SemanticStyles<'root'>
    subMenu: SemanticStyles<SubMenuSemanticName>
  }
}

const MenuContextKey: InjectionKey<Ref<MenuContextProps>> = Symbol('MenuContext')

export function useMenuContextProvider(props: Ref<MenuContextProps>) {
  provide(MenuContextKey, props)
}

export function useMenuContext(): Ref<MenuContextProps> {
  return inject(MenuContextKey, ref({
    prefixCls: '',
    firstLevel: true,
    inlineCollapsed: false,
    styles: null!,
    classes: null!,
  } as unknown as MenuContextProps))
}

export const MenuContextProvider = defineComponent<{ value: MenuContextProps }>(
  (props, { slots }) => {
    const value = computed(() => props.value)
    useMenuContextProvider(value)
    return () => {
      return slots?.default?.()
    }
  },
)
