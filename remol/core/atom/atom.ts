import { $mol_wire_atom, $mol_wire_auto, $mol_wire_cursor } from 'mol_wire_lib'

export function remolSyncRender() {
  RemolAtom.syncRender = true
}

export class RemolAtom<Host, Args extends readonly unknown[], Result> extends $mol_wire_atom<Host, Args, Result> {
  emitCb: undefined | (() => void) = undefined
  protected scheduled = false
  static syncRender = false

  emit(q: $mol_wire_cursor) {
    super.emit(q)
    if (this.scheduled) return
    this.scheduled = true
    if (RemolAtom.syncRender) {
      RemolAtom.syncRender = false
      return this.run()
    }

    Promise.resolve().then(() => this.run())
  }

  subscribe(emit: () => void) {
    this.emitCb = emit

    return () => this.scheduleDestructor()
  }

  scheduleDestructor() {
    this.emitCb = undefined
    this.scheduled = false
    Promise.resolve().then(() => this.destructor())
  }

  destructor() {
    if (this.emitCb) return
    super.destructor()
  }

  run() {
    if (!this.scheduled) return

    const prev = $mol_wire_auto()
    $mol_wire_auto(null)

    try {
      this.emitCb?.()
    } finally {
      this.scheduled = false
      $mol_wire_auto(prev)
    }
  }
}
