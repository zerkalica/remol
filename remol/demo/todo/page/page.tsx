import React from 'react'
import { stylesheet } from 'typestyle'

import { field, solo } from '@remol/core'
import { RemolView } from '@remol/react'

import { RemolDemoTodoFooter } from '../footer/footer'
import { RemolDemoTodoHeader } from '../header/header'
import { RemolDemoTodoList } from '../list/list'
import { RemolDemoTodoStore } from '../store/store'

const css = stylesheet({
  todoapp: {
    background: '#fff',
    border: '1px solid #ededed',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)',
  },
})

export class RemolDemoTodoPage extends RemolView {
  static view = (p: Partial<RemolDemoTodoPage>) => this.render(p)

  @solo store() {
    return new RemolDemoTodoStore()
  }

  @field get _() {
    return super._.clone().set(RemolDemoTodoStore.single(), this.store())
  }

  render() {
    const id = this.id()

    return (
      <div id={id} className={css.todoapp}>
        <RemolDemoTodoHeader.view id={() => `${id}_header`} />
        {this.store().filteredTodos.length > 0 ? <RemolDemoTodoList.view id={() => `${id}_list`} /> : null}
        <RemolDemoTodoFooter.view id={() => `${id}_footer`} />
      </div>
    )
  }
}
