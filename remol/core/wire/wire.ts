import { $mol_wire_cursor, $mol_wire_fiber } from 'mol_wire_lib'

import { RemolSchedule } from '../schedule/schedule'

export interface RemolWireHost<E> {
  node(): E
  up(): void
}

/**
 * fiber -> forceUpdate -> render
 * react -> shoutComponentUpdate -> render
 */
export class RemolWire<E> extends $mol_wire_fiber<RemolWireHost<E>, unknown[], E> {
  constructor(host: RemolWireHost<E>, id: string) {
    super(host, host.node, id)
  }
  protected static scheduler = new RemolSchedule<RemolWireHost<any>>()

  static rewind() {
    this.scheduler.rewind()
  }

  override emit(quant?: $mol_wire_cursor): void {
    super.emit(quant)
    RemolWire.scheduler.plan(this.host)
  }
}
