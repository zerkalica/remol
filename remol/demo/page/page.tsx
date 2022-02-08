import '@remol/react/fallback.css'

import React from 'react'

import { Remol } from '@remol/react'

import { RemolDemoCounterFunc } from '../counter/func'
import { RemolDemoCounterKlass } from '../counter/klass'
import { RemolDemoUserEdit } from '../user/edit'

export class RemolDemoPage extends Remol<{ id: string }> {
  sub(p = this.props) {
    return (
      <div
        id={p.id}
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <RemolDemoCounterFunc id={`${p.id}-counter-func`} />
        <RemolDemoCounterKlass id={`${p.id}-counter-klass`} />
        <RemolDemoUserEdit id={`${p.id}-user`} />
      </div>
    )
  }
}
