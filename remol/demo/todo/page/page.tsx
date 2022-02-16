import React from 'react'
import { stylesheet } from 'typestyle'

import { field } from '@remol/core'
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
  @field get store() {
    return new RemolDemoTodoStore(this.context, this.props.id + '-store')
  }

  @field get $() {
    return super.$.clone(this.props.id + '-$').set(RemolDemoTodoStore.instance, this.store)
  }

  sub({ id } = this.props) {
    return (
      <div id={id} className={css.todoapp}>
        <RemolDemoTodoHeader id={`${id}-header`} />
        {this.store.filteredTodos.length ? <RemolDemoTodoList id={`${id}-todo-list`} /> : null}
        <RemolDemoTodoFooter id={`${id}-footer`} />
      </div>
    )
  }
}
