import React from 'react'
import { createRoot } from 'react-dom/client'

import { RemolContext } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolDemoFetch } from './fetch/fetch'
import { RemolDemoFetchMock } from './fetch/mock'
import { RemolDemoPage } from './page/page'
import { RemolDemoTodoStoreMock } from './todo/store/mock'

const id = 'remol_demo'
const el = document.getElementById(id + '_main')!
const root = createRoot(el)

class RemolDemoFetchMockApp extends RemolDemoFetchMock {
  static todos = new RemolDemoTodoStoreMock()
  static data(pathname: string, method: string, body: any) {
    return this.todos.data(pathname, method, body)
  }
}

const $ = new RemolContext().set(RemolDemoFetch, RemolDemoFetchMockApp)
root.render(<Remol.Provide$ value={$} children={<RemolDemoPage id={id} />} />)
