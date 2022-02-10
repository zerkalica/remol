import React from 'react'
import { createRoot } from 'react-dom'

import { RemolContext } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolDemoFetch } from './fetch/fetch'
import { RemolDemoFetchMock } from './fetch/mock'
import { RemolDemoPage } from './page/page'
import { RemolDemoTodoStoreMock } from './todo/store/mock'

declare module 'react-dom' {
  export function createRoot(el: HTMLElement): {
    render(el: JSX.Element): void
  }
}

const id = 'remol-demo'
const el = document.getElementById(id)!
const root = createRoot(el)

const $ = new RemolContext().set(
  RemolDemoFetch,
  class RemolDemoFetchMockApp extends RemolDemoFetchMock {
    static todos = new RemolDemoTodoStoreMock()

    static data(pathname: string, method: string, body: any) {
      return this.todos.data(pathname, method, body)
    }
  }
)

root.render(<Remol.Provide$ value={$} children={<RemolDemoPage id={`${id}-page`} />} />)
