import React from 'react'

import { mem, remolSync } from '@remol/core'
import { Remol } from '@remol/react'

const f = remolSync({
  v() {
    return new Promise<number>(resolve => {
      setTimeout(() => {
        resolve(Math.random())
      }, 1000)
    })
  },
})

export class RemolDemoList extends Remol<{ id: string }> {
  @mem(1) value(id: number, next?: number) {
    console.log('load', id)
    return f.v()
  }

  sub(p = this.props) {
    return (
      <div id={p.id}>
        <h3>RemolDemoList</h3>
        {[1, 2].map(id => (
          <RemolDemoListItem key={id} value={this.value.bind(this, id)} />
        ))}
      </div>
    )
  }
}

class RemolDemoListItem extends React.Component<{ value(): number }> {
  render() {
    return <div>item: {this.props.value()}</div>
  }
}
