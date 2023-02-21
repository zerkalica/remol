import React from 'react'

import { action, solo } from '@remol/core'
import { RemolView } from '@remol/react'

export class RemolDemoCounter extends RemolView {
  static view = (props: Partial<RemolDemoCounter>) => this.render(props)

  @solo value(next?: number) {
    return next ?? 0
  }

  @solo computed() {
    return 'val: ' + this.value()
  }

  @action add() {
    this.value(this.value() + 1)
  }

  render() {
    return (
      <div id={this.id()}>
        <h3>RemolDemoCounterKlass</h3>
        {this.computed()}
        <button id={`${this.id()}_add`} onClick={() => this.add()}>
          Add
        </button>
      </div>
    )
  }
}
