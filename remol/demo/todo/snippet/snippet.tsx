import * as React from 'react'

import { action, mem, RemolContext } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolDemoTodo } from '../store/store'
import { RemolDemoTodoSnippetTheme } from './theme'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

class TodoItemEdit extends Object {
  constructor(protected $ = RemolContext.instance) {
    super()
  }

  @mem(0) todoBeingEditedId(next?: string | null) {
    return next
  }

  @mem(0) editText(next?: string) {
    return next ?? ''
  }

  todo() {
    return new RemolDemoTodo(this.$)
  }

  @action
  beginEdit() {
    const todo = this.todo()

    if (todo.pending) return
    if (this.todoBeingEditedId()) return

    this.todoBeingEditedId(todo.id())
    this.editText(todo.title())
  }

  @action
  setText({ target }: React.KeyboardEvent<HTMLInputElement>) {
    this.editText = (target as any).value.trim()
  }

  @action
  setEditInputRef(el?: HTMLInputElement | null) {
    el?.focus()
  }

  @action
  submit() {
    if (!this.todoBeingEditedId()) return

    const title = this.editText().trim()
    const todo = this.todo()

    if (title) {
      if (todo.title() !== title) {
        todo.title(title)
        this.editText('')
      }
    } else {
      this.remove()
    }
    this.todoBeingEditedId(null)
  }

  @action
  submitOrRestore({ which }: React.KeyboardEvent<HTMLInputElement>) {
    switch (which) {
      case ESCAPE_KEY:
        this.editText(this.todo().title())
        this.todoBeingEditedId(null)
        break

      case ENTER_KEY:
        this.submit()
        break

      default:
        break
    }
  }

  @action
  toggle() {
    this.todo().toggle()
    this.todoBeingEditedId(null)
  }

  @action
  remove() {
    this.todo().remove()
    this.todoBeingEditedId(null)
  }
}

const theme = new RemolDemoTodoSnippetTheme()

export class RemolDemoTodoSnippet extends Remol<{
  id: string
  todo: RemolDemoTodo
}> {
  @mem(0) todoItemEdit() {
    const todo = new TodoItemEdit()
    todo.todo = () => this.props.todo
    return todo
  }

  sub({ id, todo } = this.props) {
    const { css } = theme
    const todoItemEdit = this.todoItemEdit()

    if (todoItemEdit.todoBeingEditedId() === todo.id()) {
      return (
        <li id={id} className={css.editing}>
          <input
            id={`${id}-editing`}
            ref={todoItemEdit.setEditInputRef}
            className={css.edit}
            disabled={todo.pending}
            value={todoItemEdit.editText()}
            onBlur={todoItemEdit.submit}
            onInput={todoItemEdit.setText}
            onKeyDown={todoItemEdit.submitOrRestore}
          />
        </li>
      )
    }

    return (
      <li id={id} className={css.regular}>
        <input
          id={`${id}-toggle`}
          className={css.toggle}
          type="checkbox"
          disabled={todo.pending}
          checked={todo.checked()}
          onChange={todoItemEdit.toggle}
        />
        <label
          id={`${id}-beginEdit`}
          className={theme.label(todo.checked(), todo.pending)}
          onDoubleClick={todoItemEdit.beginEdit}
        >
          {todo.title()}
        </label>
        <button id={`${id}-destroy`} className={css.destroy} disabled={todo.pending} onClick={todoItemEdit.remove} />
      </li>
    )
  }
}
