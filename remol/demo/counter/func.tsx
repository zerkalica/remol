import React from 'react'

import { Remol } from '@remol/react'

export const RemolDemoCounterFunc = Remol.fc(function RemolDemoCounterFunc(p: { id: string }) {
  const { value } = Remol.mem0({
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
      <h3>RemolDemoCounterFunc</h3>
      {value()}
      <button id={`${p.id}-add`} onClick={() => add()}>
        Add
      </button>
    </div>
  )
})
