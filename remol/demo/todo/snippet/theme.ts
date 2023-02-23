import { style, stylesheet } from 'typestyle'

import type { NestedCSSProperties } from 'typestyle/lib/types.js'

export class RemolDemoTodoSnippetTheme {
  css = this.getCss()

  getCss() {
    const destroy = style({
      padding: 0,
      border: 0,
      background: 'none',
      verticalAlign: 'baseline',
      display: 'none',
      position: 'absolute',
      right: '10px',
      top: 0,
      bottom: 0,
      width: '40px',
      height: '40px',
      fontSize: '30px',
      margin: 'auto 0',
      color: '#cc9a9a',
      marginBottom: '11px',
      transition: 'color 0.2s ease-out',
      $nest: {
        '&:hover': {
          color: '#af5b5e',
        },

        '&:after': {
          content: "'×'",
        },
      },
    })

    const viewLabelBase = {
      wordBreak: 'break-all',
      padding: '15px 15px 15px 60px',
      display: 'block',
      lineHeight: '1.2',
      transition: 'color 0.4s',
    } as Record<string, NestedCSSProperties>

    const result = stylesheet({
      regular: {
        position: 'relative',
        fontSize: '24px',
        borderBottom: '1px solid #ededed',
        display: 'flex',

        $nest: {
          '&:last-child': {
            borderBottom: 'none',
          },
          [`&:hover .${destroy}`]: {
            display: 'block',
          },
        },
      },

      editing: {
        borderBottom: 'none',
        padding: 0,
        $nest: {
          '&:last-child': {
            marginBottom: '-1px',
          },
        },
      },

      edit: {
        backgroundColor: '#F2FFAB',
        display: 'block',
        zIndex: 0,
        border: 0,
        position: 'relative',
        fontSize: '24px',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        lineHeight: '1.4em',
        padding: '12px 16px',
        margin: '0 0 0 43px',
      },

      toggle: {
        textAlign: 'center',
        width: '40px',
        /* auto, since non-WebKit browsers doesn't support input styling */
        height: 'auto',
        position: 'absolute',
        top: 0,
        bottom: 0,
        margin: 'auto 0',
        border: 'none' /* Mobile Safari */,
        '-webkit-appearance': 'none',
        appearance: 'none',
        opacity: 0,
        $nest: {
          '& + label': {
            backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center left',
          },

          '&:checked + label': {
            backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E')`,
          },
        },
      },

      viewLabelRegular: viewLabelBase,

      viewLabelCompleted: {
        ...viewLabelBase,
        color: '#d9d9d9',
        textDecoration: 'line-through',
      },

      viewLabelDisabled: {
        ...viewLabelBase,
        color: '#d9d9d9',
      },
    })

    return { ...result, destroy }
  }

  label(isCompleted: boolean, isDisabled: boolean) {
    const css = this.css
    if (isDisabled) return css.viewLabelDisabled
    if (isCompleted) return css.viewLabelCompleted

    return css.viewLabelRegular
  }
}
