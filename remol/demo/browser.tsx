import React from 'react'
import { createRoot } from 'react-dom/client'

import { RemolContext } from '@remol/core'
import { RemolContextProvide } from '@remol/react'

import { RemolDemoFetch } from './fetch/fetch.js'
import { RemolDemoFetchMock } from './fetch/mock.js'
import { RemolDemoPage } from './page/page.js'
import { RemolDemoTodoStoreMock } from './todo/store/mock.js'

const id = 'remol_demo'
const el = document.getElementById(id + '_main')!
const root = createRoot(el)

class RemolDemoFetchMockApp extends RemolDemoFetchMock {
  static [Symbol.toStringTag] = id + '-mock'
  static todos = new RemolDemoTodoStoreMock()
  static data(pathname: string, method: string, body: any) {
    return this.todos.data(pathname, method, body)
  }
}

const $ = new RemolContext().set(RemolDemoFetch, RemolDemoFetchMockApp)
root.render(<RemolContextProvide value={$} children={<RemolDemoPage.view id={() => id} />} />)
