import { action, field, mem, RemolContext, remolFail } from '@remol/core'

import { RemolDemoFetch } from '../../fetch/fetch'
import { RemolDemoLocation } from '../../location/location'
import { RemolModel } from '../../model/model'
import { RemolDemoTodoDTO, RemolDemoTodoModel } from './model'

import type { RemolDemoTodoStoreMock } from './mock'

export enum TODO_FILTER {
  ALL = 'all',
  COMPLETE = 'complete',
  ACTIVE = 'active',
}

export class RemolDemoTodoStore extends Object {
  constructor(protected $ = RemolContext.instance, id = 'RemolDemoTodoStore') {
    super()
    this[Symbol.toStringTag] = id
  }

  [Symbol.toStringTag]: string

  static instance = new RemolDemoTodoStore()

  get fetcher() {
    return this.$.get(RemolDemoFetch)
  }

  @mem(0) reset(next?: null) {
    return Math.random() + new Date().getTime()
  }

  @mem(0) list() {
    this.reset()
    return this.fetcher.response('/todos').json() as ReturnType<RemolDemoTodoStoreMock['list']>
  }

  @mem(0) ids() {
    return this.list().data.ids
  }

  @mem(0) prefetched() {
    const ids = this.ids()

    return this.fetcher.batch<RemolDemoTodoDTO>('/todo?id=' + ids.join(','))
  }

  @mem(1) dto(id: string, next?: Partial<RemolDemoTodoDTO> | null) {
    if (next !== undefined) {
      const updated = this.fetcher.batch<RemolDemoTodoDTO>('/todo', {
        method: 'PATCH',
        body: JSON.stringify({ [id]: next }),
      })[id]

      this.reset(null)

      return updated
    }

    return this.prefetched()[id]
  }

  item(id = RemolModel.createId()) {
    const todo = new RemolDemoTodoModel(`${this.toString()}.items[${id}]`)
    todo.id = () => id
    todo.dto = this.dto.bind(this, id)
    return todo
  }

  @mem(0) items() {
    return this.ids().map(id => this.item(id))
  }

  get pending() {
    return this.status() === true
  }

  @mem(0) status(next?: Error | boolean) {
    return next ?? null
  }

  fetch(url: string, init: RequestInit) {
    try {
      const res = this.fetcher.response(url, init).json() as { data: { ids: string[] } }
      this.status(false)
      this.reset(null)
      return res
    } catch (error) {
      this.status(error instanceof Promise ? true : (error as Error))
      remolFail(error)
    }
  }

  get location() {
    return this.$.get(RemolDemoLocation.instance)
  }

  @field get activeTodoCount() {
    return this.list().data.activeCount
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
