import { action, field, plex, solo } from '@remol/core'

import { RemolDemoLocation } from '../../location/location.js'
import { RemolDemoModelRepo } from '../../model/repo.js'
import { RemolDemoTodoDTO, RemolDemoTodoModel } from './model.js'

import type { RemolDemoTodoStoreMock } from './mock.js'

export enum TODO_FILTER {
  ALL = 'all',
  COMPLETE = 'complete',
  ACTIVE = 'active',
}

export class RemolDemoTodoStore extends RemolDemoModelRepo<RemolDemoTodoDTO> {
  protected get(ids: readonly string[]) {
    return this.fetcher.batch<RemolDemoTodoDTO>('/todo?id=' + ids.join(','))
  }

  protected patch(rec: Record<string, Partial<RemolDemoTodoDTO> | null>) {
    return this.fetcher.batch<RemolDemoTodoDTO>('/todo', {
      method: 'PATCH',
      body: JSON.stringify(rec),
    })
  }

  @solo summary(next?: ReturnType<RemolDemoTodoStoreMock['list']>) {
    const list = next ?? (this.fetcher.response('/todos').json() as ReturnType<RemolDemoTodoStoreMock['list']>)
    this.prefetch(list.ids)

    return list
  }

  @solo items() {
    return this.summary().ids.map(id => this.item(id))
  }

  @plex item(id: string) {
    const todo = new RemolDemoTodoModel()
    todo.id = () => `${this[Symbol.toStringTag]}.item("${id}")`
    todo.dto = this.dto.bind(this, id)
    return todo
  }

  @action add(dto: RemolDemoTodoDTO) {
    this.dto(dto.id, dto)

    const prev = this.summary()

    this.summary({
      ...prev,
      activeCount: prev.activeCount + 1,
      ids: [dto.id, ...prev.ids],
    })
  }

  get location() {
    return this.ctx(RemolDemoLocation.single())
  }

  @field get activeTodoCount2() {
    const count = this.summary().activeCount
    return count
  }

  @solo activeTodoCount() {
    const count = this.summary().activeCount
    return count
  }

  @field get completedCount() {
    return this.summary().completedCount
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
