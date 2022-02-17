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
  setTitle(e: React.ChangeEvent<HTMLInputElement>) {
    this.title(e.target.value)
    // this.forceUpdate()
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

  @action.factory
  toggleAll() {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.store.toggleAll()
    }
  }

  sub({ id } = this.props) {
    console.log('header render')
    const checked = this.store.activeTodoCount2 === 0
    // const checked = this.store.activeTodoCount() === 0
    const pending = this.store.pending

    return (
      <header id={id} className={remolDemoTodoTheme.header}>
        <input
          id={`${id}-toggleAll`}
          className={remolDemoTodoTheme.toggleAll}
          disabled={pending}
          type="checkbox"
          onChange={this.toggleAll()}
          checked={checked}
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
