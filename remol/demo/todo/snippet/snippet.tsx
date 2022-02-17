import * as React from 'react'

import { action, mem } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolDemoTodoModel } from '../store/model'
import { RemolDemoTodoSnippetTheme } from './theme'

const theme = new RemolDemoTodoSnippetTheme()

export class RemolDemoTodoSnippet extends Remol<{
  id: string
  todo: RemolDemoTodoModel
}> {
  @action toggle() {
    this.props.todo.toggle()
  }

  @action remove() {
    this.props.todo.remove()
  }

  @mem(0) draft(next?: RemolDemoTodoModel | null) {
    return next ?? null
  }

  @action beginEdit() {
    const todo = this.props.todo
    if (this.draft()) return
    if (todo.pending) return

    const draft = new RemolDemoTodoModel(`${this.props.id}.draft()`)
    draft.dto(todo.dto())
    this.draft(draft)
  }

  @action submit() {
    const todo = this.props.todo
    const draft = this.draft()

    if (!draft) return

    const title = draft.title().trim()

    if (title) {
      if (todo.title() !== title) {
        todo.update(draft.dto())
      }
    } else {
      todo.remove()
    }

    this.draft(null)
  }

  @action submitOrRestore({ key }: React.KeyboardEvent<HTMLInputElement>) {
    if (key === 'Escape') return this.draft(null)
    if (key === 'Enter') return this.submit()
  }

  @action setFocusRef(el?: HTMLInputElement | null) {
    el?.focus()
  }

  @action setText(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value.trim()
    this.draft()?.title(title)
    this.forceUpdate()
  }

  Form({ id, todo } = this.props, css = theme.css, draft = this.draft()) {
    if (!draft) return null

    return (
      <li id={id} className={css.editing}>
        <input
          id={`${id}_editing`}
          ref={this.setFocusRef}
          className={css.edit}
          disabled={todo.pending}
          value={draft.title()}
          onBlur={this.submit}
          onInput={this.setText}
          onKeyDown={this.submitOrRestore}
        />
      </li>
    )
  }

  View({ id, todo } = this.props, css = theme.css) {
    return (
      <li id={id} className={css.regular}>
        <input
          id={`${id}_toggle`}
          className={css.toggle}
          type="checkbox"
          disabled={todo.pending}
          checked={todo.checked()}
          onChange={this.toggle}
        />
        <label id={`${id}_beginEdit`} className={theme.label(todo.checked(), todo.pending)} onDoubleClick={this.beginEdit}>
          {todo.title()}
        </label>
        <button id={`${id}_destroy`} className={css.destroy} disabled={todo.pending} onClick={this.remove} />
      </li>
    )
  }

  sub() {
    if (this.draft()) return this.Form()
    else return this.View()
  }
}
