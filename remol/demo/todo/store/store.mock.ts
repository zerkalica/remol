import { RemolDemoStoreMock } from '../../model/mock'

import type { RemolDemoTodoDTO } from './store'

export class RemolDemoTodoStoreMock extends RemolDemoStoreMock<RemolDemoTodoDTO> {
  override create(id: string) {
    return {
      id,
      title: 'todo #' + id,
      checked: false,
    }
  }
}
