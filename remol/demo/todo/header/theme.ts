import { stylesheet } from 'typestyle'

export const remolDemoTodoTheme = stylesheet({
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  toggleAll: {
    outline: 'none',
    width: '52px',
    height: '34px',
    display: 'block',
    lineHeight: '1.4em',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '-52px',
    marginLeft: 0,
    zIndex: 100,
    background: 'white',
  },
  newTodo: {
    width: '100%',
    fontSize: '24px',
    lineHeight: '1.4em',
    margin: 0,
    padding: '16px 16px 16px 60px',
    border: 'none',
    background: 'rgba(0, 0, 0, 0.003)',
    boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
    boxSizing: 'border-box',
  },
})
