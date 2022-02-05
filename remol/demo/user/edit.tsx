import React from 'react'
import { Remol } from '@remol/react'
import { RemolDemoUserStore } from './store'
import { action, mem } from '@remol/core'

export class RemolDemoUserEdit extends Remol<{
  id: string
}> {
  @mem(0) users() {
    return new RemolDemoUserStore()
  }

  @mem(0) userSelectedId(next?: number) {
    return next ?? 1
  }

  @mem(0) userSelected() {
    return this.users().user('' + this.userSelectedId())
  }

  @action userNext() {
    this.errorCount++
    this.userSelectedId(this.userSelectedId() + 1)
  }

  @action userSave() {
    return this.users().user('' + this.userSelectedId(), {
      first_name: this.userEditableName(),
    })
  }

  @mem(0) userEditableName(next?: string) {
    return next ?? this.userSelected().first_name
  }

  errorCount = 0

  sub(p = this.props) {
    if (this.errorCount > 0 && this.errorCount % 3 === 0) {
      const str = 'fake error ' + this.errorCount
      this.errorCount++
      throw new Error(str)
    }

    return (
      <div
        id={p.id}
        style={{
          minHeight: 50,
          minWidth: 100,
        }}
      >
        <h3>RemolDemoUserEdit</h3>
        <button type="button" onClick={() => this.userNext()}>
          Load Next
        </button>
        <p>Click 3 times to generate error</p>
        <div>
          Original: {this.userSelected().first_name}
          {this.userSelected().first_name === this.userEditableName() ? '' : ' [changed]'}
        </div>
        <input
          value={this.userEditableName()}
          onChange={Remol.inputEventFix(e => {
            this.userEditableName(e.target.value)
          })}
        />
        <button type="button" onClick={() => this.userSave()}>
          Save
        </button>
        <Inner c={this.errorCount === 2}/>
      </div>
    )
  }
}

function Inner(p: {c: boolean}) {
  if (p.c) throw new Error('Inner error')
  return <div>inner</div>
}
