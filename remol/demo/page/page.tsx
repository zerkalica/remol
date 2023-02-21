import '@remol/react/css'

import React from 'react'
import { stylesheet } from 'typestyle'

import { RemolView } from '@remol/react'

import { RemolDemoCounter } from '../counter/counter'
import { RemolDemoTodoPage } from '../todo/page/page'

const css = stylesheet({
  app: {
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: '1fr',
  },
})

export class RemolDemoPage extends RemolView {
  static view = (props: Partial<RemolDemoPage>) => this.render(props)
  render() {
    const id = this.id()
    return (
      <div id={id} className={css.app}>
        <RemolDemoCounter.view id={() => `${id}_counter`} />
        <RemolDemoTodoPage.view id={() => `${id}_todo`} />
      </div>
    )
  }
}
