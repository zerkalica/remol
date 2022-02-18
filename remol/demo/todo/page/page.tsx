import React from 'react'
import { stylesheet } from 'typestyle'

import { field, mem } from '@remol/core'
import { Remol } from '@remol/react'

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

export class RemolDemoTodoPage extends Remol<{ id: string }> {
  @mem(0) store() {
    return new RemolDemoTodoStore(this.context)
  }

  @field get $() {
    return super.$.clone().set(RemolDemoTodoStore.instance, this.store())
  }

  sub({ id } = this.props) {
    return (
      <div id={id} className={css.todoapp}>
        <RemolDemoTodoHeader id={`${id}_header`} />
        {this.store().filteredTodos.length ? <RemolDemoTodoList id={`${id}_list`} /> : null}
        <RemolDemoTodoFooter id={`${id}_footer`} />
      </div>
    )
  }
}
