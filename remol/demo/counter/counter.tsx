import React from 'react'

import { action, solo } from '@remol/core'
import { RemolView } from '@remol/react'

export class RemolDemoCounter extends RemolView {
  static view = (props: Partial<RemolDemoCounter>) => this.render(props)

  @solo value(next?: number) {
    return next ?? 0
  }

  @solo computed() {
    return 'computed: ' + this.value()
  }

  @action.bound add() {
    this.value(this.value() + 1)
  }

  render() {
    return (
      <div id={this.id()}>
        <div>{this.computed()}</div>
        <button id={`${this.id()}_add`} onClick={this.add}>
          Add
        </button>
      </div>
    )
  }
}
