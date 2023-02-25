import { $, $mol_wire_atom, $mol_wire_auto } from '../stub.js'

export function remolSyncRender() {
  RemolAtom.syncRender = true
}

export class RemolAtom<Host, Args extends readonly unknown[], Result> extends $mol_wire_atom<Host, Args, Result> {
  emit(q: $.$mol_wire_cursor) {
    super.emit(q)
    if (this.scheduled) return
    this.scheduled = true
    if (RemolAtom.syncRender) {
      RemolAtom.syncRender = false
      return this.run()
    }

    Promise.resolve().then(() => this.run())
  }

  protected update: undefined | (() => void) = undefined
  protected scheduled = false
  static syncRender = false

  subscribe(update: () => void) {
    this.update = update

    return () => this.scheduleDestructor()
  }

  scheduleDestructor() {
    this.update = undefined
    this.scheduled = false
    Promise.resolve().then(() => this.destructor())
  }

  destructor() {
    if (this.update) return
    super.destructor()
  }

  run() {
    if (!this.scheduled) return

    const prev = $mol_wire_auto()
    $mol_wire_auto(null)

    try {
      this.update?.()
    } finally {
      this.scheduled = false
      $mol_wire_auto(prev)
    }
  }
}
