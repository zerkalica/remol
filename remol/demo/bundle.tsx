import React from 'react'
import{ createRoot } from 'react-dom'

import { RemolDemoPage } from './page/page'

declare module 'react-dom' {
  export function createRoot(el: HTMLElement): {
    render(el: JSX.Element): void
  }
}

const id = 'remol-demo'
const el = document.getElementById(id)!
const root = createRoot(el)
root.render(<RemolDemoPage id={`${id}-page`} />)
