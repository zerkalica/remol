import React from 'react'
import { stylesheet } from 'typestyle'

import { RemolView } from '@remol/react'

import { RemolDemoTodoSnippet } from '../snippet/snippet'
import { RemolDemoTodoStore } from '../store/store'

const css = stylesheet({
  todoList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
})

export class RemolDemoTodoList extends RemolView {
  static view = (props: Partial<RemolDemoTodoList>) => this.render(props)

  render(store = this.ctx(RemolDemoTodoStore.single())) {
    const id = this.id()

    return (
      <ul id={id} className={css.todoList}>
        {store.filteredTodos.map(todo => (
          <RemolDemoTodoSnippet.view id={() => `${id}_todo["${todo.id()}"]`} key={todo.id()} todo={() => todo} />
        ))}
      </ul>
    )
  }
}
