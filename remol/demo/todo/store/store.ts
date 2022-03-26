import { action, field, mem, RemolContextObject, remolFail } from '@remol/core'

import { RemolDemoFetch } from '../../fetch/fetch'
import { RemolDemoLocation } from '../../location/location'
import { RemolDemoTodoDTO, RemolDemoTodoModel } from './model'

import type { RemolDemoTodoStoreMock } from './mock'

export enum TODO_FILTER {
  ALL = 'all',
  COMPLETE = 'complete',
  ACTIVE = 'active',
}

export class RemolDemoTodoStore extends RemolContextObject {
  static instance = new RemolDemoTodoStore()

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  @mem(0) reset(next?: null) {
    return new Date().getTime()
  }

  @mem(0) list() {
    this.reset()
    const list = this.fetcher.response('/todos').json() as ReturnType<RemolDemoTodoStoreMock['list']>
    return list
  }

  @mem(0) ids() {
    return this.list().data.ids
  }

  @mem(0) prefetched() {
    const ids = this.ids()
    this.reset()

    return this.fetcher.batch<RemolDemoTodoDTO>('/todo?id=' + ids.join(','))
  }

  @mem(1) dto(id: string, next?: Partial<RemolDemoTodoDTO> | null) {
    if (next !== undefined) {
      // throw new Error('test')
      const updated = this.fetcher.batch<RemolDemoTodoDTO>('/todo', {
        method: 'PATCH',
        body: JSON.stringify({ [id]: next }),
      })[id]

      return updated ?? {}
    }

    return (
      this.prefetched()[id] ?? {
        id,
        title: '',
        checked: false,
      }
    )
  }

  @mem(1) item(id: string) {
    const todo = new RemolDemoTodoModel(`${this[Symbol.toStringTag]}.item("${id}")`)
    todo.dto = this.dto.bind(this, id)
    return todo
  }

  @mem(0) items() {
    return this.ids().map(id => this.item(id))
  }

  fetch(url: string, init: RequestInit) {
    const res = this.fetcher.response(url, init).json() as { data: { ids: string[] } }
    this.reset(null)
    return res
  }

  get location() {
    return this.$.get(RemolDemoLocation.instance)
  }

  @field get activeTodoCount2() {
    const count = this.list().data.activeCount
    return count
  }

  @mem(0) activeTodoCount() {
    const count = this.list().data.activeCount
    return count
  }

  @field get completedCount() {
    return this.list().data.completedCount
  }

  filter(next?: TODO_FILTER) {
    return this.location.value<TODO_FILTER>('todo_filter', next) ?? TODO_FILTER.ALL
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

  @action toggleAll() {
    this.fetch('/todos/toggle', { method: 'PATCH' })
  }

  @action completeAll() {
    this.fetch('/todos/complete', { method: 'PATCH' })
  }

  @action clearCompleted() {
    this.fetch('/todos/complete', { method: 'DELETE' })
  }
}
