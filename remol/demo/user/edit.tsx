import React from 'react'

import { action, solo } from '@remol/core'
import { RemolView } from '@remol/react'

import { RemolDemoUserStore } from './store.js'

export class RemolDemoUserEdit extends RemolView {
  static view = (p: Partial<RemolDemoUserEdit>) => this.render(p)

  @solo users() {
    return new RemolDemoUserStore()
  }

  @solo userSelectedId(next?: number) {
    return next ?? 1
  }

  @solo userSelected() {
    return this.users().user('' + this.userSelectedId())
  }

  @action userNext() {
    this.errorCount++
    this.userSelectedId(this.userSelectedId() + 1)
  }

  @action userSave() {
    this.users().user('' + this.userSelectedId(), {
      first_name: this.userEditableName(),
    })
  }

  @solo userEditableName(next?: string) {
    return next ?? this.userSelected().first_name
  }

  errorCount = 0

  render() {
    if (this.errorCount > 0 && this.errorCount % 3 === 0) {
      const str = 'fake error ' + this.errorCount
      this.errorCount++
      throw new Error(str)
    }

    return (
      <div
        id={this.id()}
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
          onChange={e => {
            this.userEditableName(e.target.value)
          }}
        />
        <button type="button" onClick={() => this.userSave()}>
          Save
        </button>
        <Inner c={this.errorCount === 2} />
      </div>
    )
  }
}

function Inner(p: { c: boolean }) {
  if (p.c) throw new Error('Inner error')
  return <div>inner</div>
}
