import React from 'react'

import { action, field, RemolQueue, remolSyncRender, solo } from '@remol/core'
import { RemolView } from '@remol/react'

import { RemolModel } from '../../model/model.js'
import { RemolDemoTodoStore } from '../store/store.js'
import { remolDemoTodoTheme } from './theme.js'

export class RemolDemoTodoHeader extends RemolView {
  static view = (p: Partial<RemolDemoTodoHeader>) => this.render(p)

  get store() {
    return this.ctx(RemolDemoTodoStore.single())
  }

  @solo title(next?: string) {
    return next ?? ''
  }

  @action setTitle(
    e: React.FormEvent<HTMLInputElement> & {
      target: { value?: string }
    }
  ) {
    remolSyncRender()
    this.title(e.target.value)
  }

  @action setRef(ref?: HTMLInputElement | null) {
    ref?.focus()
  }

  @field get submitStatus() {
    return new RemolQueue()
  }

  @action submit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !this.title()) return
    this.submitStatus.run(() => {
      this.store.add({
        id: RemolModel.createId(),
        title: this.title(),
        checked: false,
      })
      this.title('')
    })
  }

  @field get toggleAllStatus() {
    return new RemolQueue()
  }

  @action toggleAll() {
    this.toggleAllStatus.run(() => {
      this.store.toggleAll()
    })
  }

  override render() {
    const id = this.id()
    const checked = this.store.activeTodoCount() === 0

    return (
      <header id={id} className={remolDemoTodoTheme.header}>
        <input
          id={`${id}_toggleAll`}
          className={remolDemoTodoTheme.toggleAll}
          disabled={this.toggleAllStatus.pending}
          type="checkbox"
          onChange={() => this.toggleAll()}
          checked={checked}
        />
        <input
          id={`${id}_input`}
          className={remolDemoTodoTheme.newTodo}
          placeholder="What needs to be done?"
          onInput={e => this.setTitle(e)}
          ref={r => this.setRef(r)}
          disabled={this.submitStatus.pending}
          value={this.title()}
          onKeyDown={e => this.submit(e)}
        />
      </header>
    )
  }
}
