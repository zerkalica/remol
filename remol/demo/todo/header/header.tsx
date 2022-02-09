import React from 'react'

import { action, mem } from '@remol/core'
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
  setRef(ref?: HTMLInputElement | null) {
    ref?.focus()
  }

  @action
  setTitle({ target }: React.ChangeEvent<HTMLInputElement>) {
    this.title(target.value)
  }

  @action
  submit({ key }: React.KeyboardEvent<HTMLInputElement>) {
    if (key !== 'enter' || !this.title()) return

    this.store.model().title(this.title())
    this.title('')
  }

  sub({ id } = this.props) {
    return (
      <header id={id} className={remolDemoTodoTheme.header}>
        <input
          id={`${id}-toggleAll`}
          disabled={this.store.patching()?.running}
          type="checkbox"
          onChange={this.store.toggleAll}
          className={remolDemoTodoTheme.toggleAll}
          checked={this.store.activeTodoCount === 0}
        />
        <input
          id={`${id}-input`}
          className={remolDemoTodoTheme.newTodo}
          placeholder="What needs to be done?"
          onInput={this.setTitle}
          onChange={() => {}}
          ref={this.setRef}
          value={this.title()}
          onKeyDown={this.submit}
        />
      </header>
    )
  }
}
