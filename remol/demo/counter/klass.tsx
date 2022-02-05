import React from 'react'

import { Remol } from '@remol/react'
import { action, mem } from '@remol/core'

export class RemolDemoCounterKlass extends Remol<{ id: string }> {
  @mem(0) value(next?: number) {
    return next ?? 0
  }

  @mem(0) computed() {
    return 'val: ' + this.value()
  }

  @action add() {
    this.value(this.value() + 1)
  }

  sub(p = this.props) {
    return (
      <div id={p.id}>
        <h3>RemolDemoCounterKlass</h3>
        {this.computed()}
        <button id={`${p.id}-add`} onClick={() => this.add()}>
          Add
        </button>
      </div>
    )
  }
}
