import type { CSSObject } from '@antdv-next/cssinjs'
import type { GenerateStyle } from '../../theme/interface'

import type { SelectToken } from './token'
import { unit } from '@antdv-next/cssinjs'
import { resetComponent, textEllipsis } from '../../style'
import { genCssVar } from '../../theme/util/genStyleUtils'
import genSelectInputCustomizeStyle from './select-input-customize'
import genSelectInputMultipleStyle from './select-input-multiple'

interface VariableColors {
  border: string
  borderHover: string
  borderActive: string
  borderOutline: string
  borderDisabled?: string

  background?: string
  backgroundHover?: string
  backgroundActive?: string
  backgroundDisabled?: string

  color?: string
}

/** Set CSS variables and hover/focus styles for a Select input based on provided colors. */
function genSelectInputVariableStyle(token: SelectToken, colors: VariableColors): CSSObject {
  const { componentCls, antCls } = token

  const [varName] = genCssVar(antCls, 'select')

  const { border, borderHover, borderActive, borderOutline } = colors

  const baseBG = colors.background || token.selectorBg || token.colorBgContainer

  return {
    [varName('border-color')]: border,
    [varName('background-color')]: baseBG,
    [varName('color')]: colors.color || token.colorText,

    [`&:not(${componentCls}-disabled)`]: {
      '&:hover': {
        [varName('border-color')]: borderHover,
        [varName('background-color')]: colors.backgroundHover || baseBG,
      },

      [`&${componentCls}-focused`]: {
        [varName('border-color')]: borderActive,
        [varName('background-color')]: colors.backgroundActive || baseBG,

        boxShadow: `0 0 0 ${unit(token.controlOutlineWidth)} ${borderOutline}`,
      },
    },

    [`&${componentCls}-disabled`]: {
      [varName('border-color')]: colors.borderDisabled || colors.border,
      [varName('background-color')]: colors.backgroundDisabled || colors.background,
    },
  }
}

/** Generate variant-scoped variable styles and status overrides for a Select input. */
function genSelectInputVariantStyle(token: SelectToken, variant: string, colors: VariableColors, errorColors: Partial<VariableColors> = {}, warningColors: Partial<VariableColors> = {}, patchStyle?: CSSObject): CSSObject {
  const { componentCls } = token
  return {
    [`&${componentCls}-${variant}`]: [
      genSelectInputVariableStyle(token, colors),
      {
        [`&${componentCls}-status-error`]: genSelectInputVariableStyle(token, {
          ...colors,
          color: errorColors.color || token.colorError,
          ...errorColors,
        }),
        [`&${componentCls}-status-warning`]: genSelectInputVariableStyle(token, {
          ...colors,
          color: warningColors.color || token.colorWarning,
          ...warningColors,
        }),
      },
      patchStyle,
    ],
  }
}

const genSelectInputStyle: GenerateStyle<SelectToken> = (token) => {
  const { componentCls, fontHeight, controlHeight, antCls, calc } = token
  const [varName, varRef] = genCssVar(antCls, 'select')
  return {
    [componentCls]: [
      {
        // Border
        [varName('border-radius')]: token.borderRadius,
        [varName('border-color')]: '#000',
        [varName('border-size')]: token.lineWidth,
        // Background
        [varName('background-color')]: token.colorBgContainer,
        // Font
        [varName('font-size')]: token.fontSize,
        [varName('line-height')]: token.lineHeight,
        [varName('font-height')]: fontHeight,
        [varName('color')]: token.colorText,
        // Size
        [varName('height')]: controlHeight,

        [varName('padding-horizontal')]: calc(token.paddingSM).sub(token.lineWidth).equal(),
        [varName('padding-vertical')]:
          `calc((${varRef('height')} - ${varRef('font-height')}) / 2 - ${varRef('border-size')})`,

        // ==========================================================
        // ==                         Base                         ==
        // ==========================================================
        ...resetComponent(token, true),

        display: 'inline-flex',
        // gap: calc(token.paddingXXS).mul(1.5).equal(),
        flexWrap: 'nowrap',
        position: 'relative',
        transition: `all ${token.motionDurationSlow}`,
        alignItems: 'flex-start',
        outline: 0,

        cursor: 'pointer',

        // Border
        borderRadius: varRef('border-radius'),
        borderWidth: varRef('border-size'),
        borderStyle: token.lineType,
        borderColor: varRef('border-color'),

        // Background
        background: varRef('background-color'),

        // Font
        fontSize: varRef('font-size'),
        lineHeight: varRef('line-height'),
        color: varRef('color'),

        // Padding
        paddingInline: varRef('padding-horizontal'),
        paddingBlock: varRef('padding-vertical'),

        // ========================= Prefix =========================
        [`${componentCls}-prefix`]: {
          flex: 'none',
          lineHeight: 1,
        },

        // ====================== Placeholder =======================
        [`${componentCls}-placeholder`]: {
          ...textEllipsis,
          color: token.colorTextPlaceholder,
          pointerEvents: 'none',
          zIndex: 1,
        },

        // ======================== Content =========================
        [`${componentCls}-content`]: {
          'flex': 'auto',
          'minWidth': 0,
          'position': 'relative',
          'display': 'flex',
          'marginInlineEnd': calc(token.paddingXXS).mul(1.5).equal(),

          '&:before': {
            content: '"\\a0"',
            width: 0,
            overflow: 'hidden',
          },

          // >>> Value
          '&-value': {
            ...textEllipsis,
            transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
            zIndex: 1,
          },

          // >>> Input: should only take effect for not customize mode

          // input element with readOnly use cursor pointer
          'input[readonly]': {
            cursor: 'inherit',
            caretColor: 'transparent',
          },
        },

        [`&-open ${componentCls}-content-value`]: {
          color: token.colorTextPlaceholder,
        },

        // ========================= Suffix =========================
        [`${componentCls}-suffix`]: {
          'flex': 'none',
          'color': token.colorTextQuaternary,
          'fontSize': token.fontSizeIcon,
          'lineHeight': 1,

          '> :not(:last-child)': {
            marginInlineEnd: token.marginXS,
          },
        },

        [`${componentCls}-prefix, ${componentCls}-suffix`]: {
          alignSelf: 'center',
        },

        // ========================= Search =========================
        [`${componentCls}-search`]: {
          flex: 'auto',

          // >>> Icon
          [`${componentCls}-suffix`]: {
            pointerEvents: 'none',
          },
        },

        // ========================= Clear ==========================
        [`${componentCls}-clear`]: {
          'position': 'absolute',
          'top': '50%',
          'insetInlineEnd': token.paddingXS,
          'transform': 'translateY(-50%)',

          'lineHeight': 0,
          'fontSize': token.fontSizeIcon,
          'color': token.colorTextQuaternary,
          'background': varRef('background-color'),
          'cursor': 'pointer',
          'transition': `color ${token.motionDurationMid}`,

          '&:hover': {
            color: token.colorTextTertiary,
          },
        },

        // ======================= Clear Hover ======================
        [`&${componentCls}-allow-clear ${componentCls}-content`]: {
          marginInlineEnd: token.fontSizeIcon + token.controlPaddingHorizontal,
        },

        // ====================== Arrow & Clear ======================
        [`&${componentCls}-show-arrow`]: {
          [`${componentCls}-suffix`]: {
            cursor: 'pointer',
          },
        },

        // ========================= Disabled ========================
        [`&${componentCls}-disabled`]: {
          cursor: 'not-allowed',
          [`${componentCls}-selection-item`]: {
            userSelect: 'none',
          },
        },
      },

      // ======================= Variants =======================
      genSelectInputVariantStyle(token, 'outlined', {
        border: token.colorBorder,
        borderHover: token.hoverBorderColor,
        borderActive: token.activeBorderColor,
        borderOutline: token.activeOutlineColor,
        borderDisabled: token.colorBorder,
      }),
      genSelectInputVariantStyle(
        token,
        'filled',
        {
          border: 'transparent',
          borderHover: 'transparent',
          borderActive: 'transparent',
          borderOutline: token.activeOutlineColor,
          background: token.colorFillTertiary,
          backgroundHover: token.colorFillSecondary,
          backgroundActive: token.colorFillSecondary,
        },
        {
          borderActive: token.colorError,
          borderOutline: token.colorErrorOutline,
          backgroundActive: token.colorErrorBg,
          backgroundHover: token.colorErrorBg,
        },
        {
          borderActive: token.colorWarning,
          borderOutline: token.colorWarningOutline,
          backgroundActive: token.colorWarningBg,
          backgroundHover: token.colorWarningBg,
        },
        {
          [`&${componentCls}-disabled`]: {
            [varName('background-color')]: token.colorFillTertiary,
          },
        },
      ),
      genSelectInputVariantStyle(token, 'borderless', {
        border: 'transparent',
        borderHover: 'transparent',
        borderActive: 'transparent',
        borderOutline: 'transparent',
        background: 'transparent',
        backgroundHover: 'transparent',
        backgroundActive: 'transparent',
      }),
      genSelectInputVariantStyle(token, 'underlined', {
        border: 'transparent',
        borderHover: 'transparent',
        borderActive: 'transparent',
        borderOutline: 'transparent',
        background: 'transparent',
        backgroundHover: 'transparent',
        backgroundActive: 'transparent',
      }),

      // ====================== Multiple Input =======================
      genSelectInputMultipleStyle(token),

      // ===================== Custom Input ======================
      genSelectInputCustomizeStyle(token),

      // ========================= RTL ==========================
      {
        '&-rtl': {
          direction: 'rtl',
          [`${componentCls}-content`]: {
            flexDirection: 'row-reverse',
            marginInlineEnd: 0,
            marginInlineStart: calc(token.paddingXXS).mul(1.5).equal(),
          },
        },
      },

      // ========================= Size ==========================
      {
        '&-sm': {
          [varName('height')]: token.controlHeightSM,
          [varName('padding-horizontal')]: calc(token.paddingXS).sub(token.lineWidth).equal(),
          [varName('border-radius')]: token.borderRadiusSM,
        },

        '&-lg': {
          [varName('height')]: token.controlHeightLG,
          [varName('font-size')]: token.fontSizeLG,
          [varName('line-height')]: token.lineHeightLG,
          [varName('font-height')]: token.fontHeightLG,
          [varName('border-radius')]: token.borderRadiusLG,
        },
      },

      // ===================== Single Input =====================
      {
        [`&${componentCls}-single`]: {
          [`${componentCls}-clear`]: {
            insetBlock: `calc(${varRef('padding-vertical')} * -1)`,
            lineHeight: `calc(${varRef('font-height')} + ${varRef('padding-vertical')} * 2)`,
          },
        },
      },

      // ======================== Selector =======================
      {
        [`${componentCls}-selector`]: {
          flex: 'auto',
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: '100%',
        },
      },
    ],
  }
}

export default genSelectInputStyle
