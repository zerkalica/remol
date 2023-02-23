import '@remol/react/css'

import React from 'react'
import { stylesheet } from 'typestyle'

import { RemolView } from '@remol/react'

import { RemolDemoCounter } from '../counter/counter.js'
import { RemolDemoPomodoro } from '../pomodoro/pomodoro.js'
import { RemolDemoTodoPage } from '../todo/page/page.js'

const css = stylesheet({
  app: {
    display: 'flex',
    gap: '2rem',
    flexDirection: 'column',
  },
})

export class RemolDemoPage extends RemolView {
  static view = (props: Partial<RemolDemoPage>) => this.render(props)
  render() {
    const id = this.id()
    return (
      <div id={id} className={css.app}>
        <div>
          <h3>Counter</h3>
          <RemolDemoCounter.view id={() => `${id}_counter`} />
        </div>
        <div>
          <h3>Pomodoro</h3>
          <RemolDemoPomodoro.view id={() => `${id}_pomodoro`} />
        </div>
        <div>
          <h3>Todomvc with "server" sync</h3>
          <RemolDemoTodoPage.view id={() => `${id}_todo`} />
        </div>
      </div>
    )
  }
}
