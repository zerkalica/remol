import { RemolDemoStoreMock } from '../../model/mock'

import type { RemolDemoTodoDTO } from './model'

export class RemolDemoTodoStoreMock extends RemolDemoStoreMock<RemolDemoTodoDTO> {
  max() {
    return 1
  }

  override create(id: string) {
    return {
      id,
      title: 'todo #' + id,
      checked: false,
    }
  }

  data(pathname: string, method: string, body: any) {
    if (pathname === '/todo' && method === 'GET' && body.id) return this.get(body.id)
    if (pathname === '/todo' && method === 'PATCH') return this.patch(body)
    if (pathname === '/todos' && method === 'GET') return this.list()
    if (pathname === '/todos/complete' && method === 'PATCH') return this.completeAll()
    if (pathname === '/todos/complete' && method === 'DELETE') return this.clearCompleted()
    if (pathname === '/todos/toggle' && method === 'PATCH') return this.toggleAll()
  }

  override list(filter?: unknown) {
    const ids = [] as string[]
    let activeCount = 0
    const todos = Object.values(this.items)

    for (const todo of todos) {
      ids.push(todo.id)
      activeCount += todo.checked ? 0 : 1
    }

    return {
      data: {
        ids,
        activeCount,
        completedCount: todos.length - activeCount,
      },
    }
  }

  toggleAll() {
    const items = Object.values(this.items)
    const checked = !!items.find(todo => !todo.checked)
    for (const todo of items) {
      todo.checked = checked
    }
    return {
      data: {
        ids: items.map(todo => todo.id),
      },
    }
  }

  completeAll() {
    const items = Object.values(this.items)
    for (const todo of items) {
      todo.checked = true
    }
    return {
      data: {
        ids: items.map(todo => todo.id),
      },
    }
  }

  clearCompleted() {
    const items = Object.values(this.items)
    for (const todo of items) {
      if (todo.checked) delete this.items[todo.id]
    }

    return {
      data: {
        ids: items.map(todo => todo.id),
      },
    }
  }
}
