import React from 'react'
import { stylesheet } from 'typestyle'

import { Remol } from '@remol/react'

import { RemolDemoTodoSnippet } from '../snippet/snippet'
import { RemolDemoTodoStore } from '../store/store'

const css = stylesheet({
  todoList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
})

export class RemolDemoTodoList extends Remol<{ id: string }> {
  sub({ id } = this.props, store = this.$.get(RemolDemoTodoStore.instance)) {
    return (
      <ul id={id} className={css.todoList}>
        {store.filteredTodos.map(todo => (
          <RemolDemoTodoSnippet id={`${id}-todo[${todo.id()}]`} key={todo.id()} todo={todo} />
        ))}
      </ul>
    )
  }
}
