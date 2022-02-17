import { $mol_wire_auto, $mol_wire_cursor, $mol_wire_fiber } from 'mol_wire_lib'

export interface RemolWireHost<E> {
  node(): E
  update(): void
}

export class RemolWire<E> extends $mol_wire_fiber<RemolWireHost<E>, unknown[], E> {
  constructor(host: RemolWireHost<E>, id: string) {
    super(host, host.node, id)
  }

  override emit(quant?: $mol_wire_cursor): void {
    // if changed via props/state do not run forceUpdate
    if (this.rendering) return
    // super.emit(quant)

    try {
      this.rendering = true
      // forceUpdate can call render on any component. Disable slave -> master relations.
      $mol_wire_auto(null)
      this.host.update()
    } catch (error: any) {
      // if (!(this.cache instanceof Error)) super.put(error)
    }
    console.log(this, 'render off')
    this.rendering = false
  }

  protected rendering = false

  render() {
    if (this.rendering) {
      if (this.cache instanceof Error) throw this.cache
      return this.cache
    }
    this.rendering = true
    try {
      const result = this.sync()
      this.rendering = false
      return result
    } finally {
      console.log(this, 'render off')
    }
  }
}
