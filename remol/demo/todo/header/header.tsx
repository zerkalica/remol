import React from 'react'

import { action, mem, RemolActionQueue } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolModel } from '../../model/model'
import { RemolDemoTodoStore } from '../store/store'
import { remolDemoTodoTheme } from './theme'

export class RemolDemoTodoHeader extends Remol<{ id: string }> {
  get store() {
    return this.$.get(RemolDemoTodoStore.instance)
  }

  @mem(0) title(next?: string) {
    return next ?? ''
  }

  @action.sync setTitle(e: React.ChangeEvent<HTMLInputElement>) {
    this.title(e.target.value)
  }

  @action setRef(ref?: HTMLInputElement | null) {
    ref?.focus()
  }

  @mem(0) submitStatus() {
    return new RemolActionQueue()
  }

  @action submit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !this.title()) return
    this.submitStatus().run(() => {
      this.store.item(RemolModel.createId()).title(this.title())
      this.title('')
    })
  }

  @action.factory toggleAll() {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      this.store.toggleAll()
    }
  }

  sub({ id } = this.props) {
    // const checked = this.store.activeTodoCount2 === 0
    const checked = this.store.activeTodoCount() === 0
    const pending = this.store.pending

    return (
      <header id={id} className={remolDemoTodoTheme.header}>
        {this.store.error?.stack ?? ''}
        <input
          id={`${id}_toggleAll`}
          className={remolDemoTodoTheme.toggleAll}
          disabled={pending}
          type="checkbox"
          onChange={this.toggleAll()}
          checked={checked}
        />
        <input
          id={`${id}_input`}
          className={remolDemoTodoTheme.newTodo}
          placeholder="What needs to be done?"
          onInput={this.setTitle}
          ref={this.setRef}
          disabled={this.submitStatus().pending}
          value={this.title()}
          onKeyDown={this.submit}
        />
      </header>
    )
  }
}
