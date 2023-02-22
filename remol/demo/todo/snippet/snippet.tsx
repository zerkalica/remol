import * as React from 'react'

import { action, remolSyncRender, solo } from '@remol/core'
import { RemolView } from '@remol/react'

import { RemolDemoTodoModel } from '../store/model'
import { RemolDemoTodoSnippetTheme } from './theme'

const theme = new RemolDemoTodoSnippetTheme()

export class RemolDemoTodoSnippet extends RemolView {
  static view = (props: Partial<RemolDemoTodoSnippet>) => this.render(props)

  @solo todo() {
    return new RemolDemoTodoModel()
  }

  @action toggle() {
    this.todo().toggle()
  }

  @action remove() {
    this.todo().remove()
  }

  @solo draft(next?: RemolDemoTodoModel | null) {
    return next ?? null
  }

  @action beginEdit() {
    const todo = this.todo()
    if (this.draft()) return
    if (todo.pending) return

    const draft = new RemolDemoTodoModel()
    draft.id = () => `${this.id()}.draft()`
    draft.dto(todo.dto())
    this.draft(draft)
  }

  @action submit() {
    const todo = this.todo()
    const draft = this.draft()

    if (!draft) return

    const title = draft.title().trim()

    if (title) {
      if (todo.title() !== title) {
        todo.dto_safe(draft.dto())
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

  @action setTitle(e: React.FormEvent<HTMLInputElement> & { target: { value?: string } }) {
    remolSyncRender()
    this.draft()?.title(e.target.value?.trim() ?? '')
  }

  Form() {
    const todo = this.todo()
    const id = this.id()
    const css = theme.css
    const draft = this.draft()
    if (!draft) return null

    return (
      <li id={id} className={css.editing}>
        <input
          id={`${id}_editing`}
          ref={r => this.setFocusRef(r)}
          className={css.edit}
          disabled={todo.pending}
          value={draft.title()}
          onBlur={() => this.submit()}
          onInput={e => this.setTitle(e)}
          onKeyDown={e => this.submitOrRestore(e)}
        />
      </li>
    )
  }

  View(id = this.id(), todo = this.todo(), css = theme.css) {
    console.log('render, todo is pending=', todo.pending)

    return (
      <li id={id} className={css.regular}>
        <input
          id={`${id}_toggle`}
          className={css.toggle}
          type="checkbox"
          disabled={todo.pending}
          checked={todo.checked()}
          onChange={() => this.toggle()}
        />
        <label
          id={`${id}_beginEdit`}
          className={theme.label(todo.checked(), todo.pending)}
          onDoubleClick={() => this.beginEdit()}
        >
          {todo.title()}
        </label>
        <button id={`${id}_destroy`} className={css.destroy} disabled={todo.pending} onClick={() => this.remove()} />
      </li>
    )
  }

  override render() {
    if (this.draft()) return this.Form()
    return this.View()
  }
}
