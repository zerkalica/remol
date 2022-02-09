import { action, field } from '@remol/core'

import { RemolDemoLocation } from '../../location/location'
import { RemolModel } from '../../model/model'
import { RemolModelStore } from '../../model/store'

type RemolDemoTodoDTO = {
  id: string
  title: string
  checked: boolean
}

export class RemolDemoTodo extends RemolModel<RemolDemoTodoDTO> {
  static instance = new RemolDemoTodo()
  override api() {
    return '/todo'
  }

  title(next?: RemolDemoTodoDTO['title']) {
    return this.dto_pick('title', next)
  }

  @action
  toggle() {
    this.checked(!this.checked())
  }

  checked(next?: RemolDemoTodoDTO['checked']) {
    return this.dto_pick('checked', next)
  }
}

export enum TODO_FILTER {
  ALL = 'all',
  COMPLETE = 'complete',
  ACTIVE = 'active',
}

export class RemolDemoTodoStore extends RemolModelStore<RemolDemoTodo> {
  static instance = new RemolDemoTodoStore()

  override api() {
    return '/todos'
  }

  override model() {
    return new RemolDemoTodo(this.$)
  }

  @field get activeTodoCount() {
    return this.items().reduce((sum, todo) => sum + (todo.checked() ? 0 : 1), 0)
  }

  get completedCount() {
    return this.items().length - this.activeTodoCount
  }

  get location() {
    return this.$.get(RemolDemoLocation.instance)
  }

  filter(next?: TODO_FILTER) {
    return (this.location.value('todo_filter', next) as TODO_FILTER) ?? TODO_FILTER.ALL
  }

  @field get filteredTodos() {
    const todos = this.items()

    switch (this.filter()) {
      case TODO_FILTER.ALL:
        return todos
      case TODO_FILTER.COMPLETE:
        return todos.filter(todo => !!todo.checked())
      case TODO_FILTER.ACTIVE:
        return todos.filter(todo => !todo.checked())
    }
  }

  @action
  toggleAll() {
    const checked = !!this.items().find(todo => !todo.checked())
    for (const todo of this.items()) {
      this.patch(todo.id(), { checked })
    }
  }

  @action
  completeAll() {
    for (const todo of this.items()) {
      if (!todo.checked()) this.patch(todo.id(), { checked: true })
    }
  }

  @action
  clearCompleted() {
    for (const todo of this.items()) {
      if (todo.checked()) this.patch(todo.id(), null)
    }
  }
}
