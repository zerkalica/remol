import '@remol/react/fallback.css'

import React from 'react'
import { stylesheet } from 'typestyle'

import { Remol } from '@remol/react'

import { RemolDemoTodoPage } from '../todo/page/page'

const css = stylesheet({
  app: {
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: '1fr 1fr',
  },
})

export class RemolDemoPage extends Remol<{ id: string }> {
  sub(p = this.props) {
    return (
      <div id={p.id} className={css.app}>
        {/* <RemolDemoList id={`${p.id}-list`} /> */}
        {/* <RemolDemoCounterFunc id={`${p.id}-counter-func`} /> */}
        {/* <RemolDemoCounterKlass id={`${p.id}-counter-klass`} /> */}
        {/* <RemolDemoUserEdit id={`${p.id}-user-edit`} /> */}
        <RemolDemoTodoPage id={`${p.id}-todo-page`} />
      </div>
    )
  }
}
