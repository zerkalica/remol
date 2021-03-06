import React from 'react'

import { mem } from '@remol/core'
import { Remol } from '@remol/react'

let some = 1

export const RemolDemoCounterFunc = Remol.fc(function RemolDemoCounterFunc(p: { id: string }) {
  const { value } = Remol.mem(0, {
    value(next?: number) {
      return next ?? 0
    },
  })
  const { add } = Remol.action({
    add() {
      value(value() + 1)
    },
  })

  return (
    <div id={p.id}>
      <TestInput key={1} some={value()} />
      <TestInput2 />
      <TestInput3 />
      <h3>RemolDemoCounterFunc</h3>
      {value()}
      <button id={`${p.id}_add`} onClick={() => add()}>
        Add
      </button>
    </div>
  )
})

const TestInput = React.memo(function TestInput(p: { some: number }) {
  const [v, setValue] = React.useState('')

  return <input onChange={e => setValue(e.target.value)} value={v} />
})

class TestInput2 extends React.Component {
  v = ''
  render() {
    return (
      <input
        onChange={e => {
          this.v = e.target.value
          this.forceUpdate()
        }}
        value={this.v}
        placeholder="klass"
      />
    )
  }
}

class TestInput3 extends Remol {
  @mem(0) v(next?: string) {
    return next ?? ''
  }
  sub() {
    return (
      <input
        onChange={e => {
          this.v(e.target.value)
        }}
        value={this.v()}
        placeholder="remol klass"
      />
    )
  }
}
