import { $mol_wire_atom, $mol_wire_cursor } from 'mol_wire_lib'

import { RemolSchedule } from '../schedule/schedule'

export interface RemolWireHost<E> {
  node(): E
  up(): void
}

/**
 * fiber -> forceUpdate -> render
 * react -> shoutComponentUpdate -> render
 */
export class RemolWire<Result> extends $mol_wire_atom<RemolWireHost<Result>, unknown[], Result> {
  constructor(host: RemolWireHost<Result>, id: string) {
    super(id, host.node, host)
  }
  protected static scheduler = new RemolSchedule<RemolWireHost<any>>()

  override emit(quant?: $mol_wire_cursor): void {
    super.emit(quant)
    if (this.host) RemolWire.scheduler.plan(this.host)
  }
}
