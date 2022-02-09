import { stylesheet } from 'typestyle'

export class RemolTodoFooterTheme {
  static css = this.getCss()

  protected static getCss() {
    const linkBase = {
      color: 'inherit',
      margin: '3px',
      padding: '3px 7px',
      textDecoration: 'none',
      border: '1px solid transparent',
      borderRadius: '3px',
      $nest: {
        '&:hover': {
          borderColor: 'rgba(175, 47, 47, 0.1)',
        },
      },
    }

    return stylesheet({
      footer: {
        color: '#777',
        padding: '10px 15px',
        height: '20px',
        display: 'flex',
        borderTop: '1px solid #e6e6e6',
      },

      todoCount: {},

      filters: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
      },

      filterItem: {
        display: 'inline',
      },

      linkRegular: linkBase,

      linkSelected: {
        ...linkBase,
        borderColor: 'rgba(215, 47, 47, 0.2)',
      },

      clearCompleted: {
        margin: 0,
        padding: 0,
        border: 0,
        background: 'none',
        fontSize: '100%',
        verticalAlign: 'baseline',
        lineHeight: '20px',
        textDecoration: 'none',
        cursor: 'pointer',
        $nest: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    })
  }
}
