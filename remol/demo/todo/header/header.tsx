import React from 'react'

import { action, mem, remolEventFactory } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolDemoTodoStore } from '../store/store'
import { remolDemoTodoTheme } from './theme'

export class RemolDemoTodoHeader extends Remol<{ id: string }> {
  get store() {
    return this.$.get(RemolDemoTodoStore.instance)
  }

  @mem(0) title(next?: string) {
    return next ?? ''
  }

  @action
  setTitle(e: React.ChangeEvent<HTMLInputElement>) {
    this.title(e.target.value)
    this.update()
  }

  @action
  setRef(ref?: HTMLInputElement | null) {
    ref?.focus()
  }

  @action
  submit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'enter' || !this.title()) return

    this.store.item().title(this.title())
    this.title('')
  }

  @remolEventFactory(1)
  toggleAll() {
    return async (e: React.ChangeEvent<HTMLInputElement>) => this.store.toggleAll()
  }

  sub({ id } = this.props) {
    return (
      <header id={id} className={remolDemoTodoTheme.header}>
        <input
          id={`${id}-toggleAll`}
          className={remolDemoTodoTheme.toggleAll}
          disabled={this.store.pending}
          type="checkbox"
          onChange={this.toggleAll()}
          checked={this.store.activeTodoCount === 0}
        />
        <input
          id={`${id}-input`}
          className={remolDemoTodoTheme.newTodo}
          placeholder="What needs to be done?"
          onInput={this.setTitle}
          ref={this.setRef}
          value={this.title()}
          onKeyDown={this.submit}
        />
      </header>
    )
  }
}
