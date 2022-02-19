import { $mol_wire_mem } from 'mol_wire_lib'

import { remolAction } from '../action/action'

export class RemolWireFunc {
  static mem<O extends Record<string, Function>>(index: number, obj: O) {
    const mem = $mol_wire_mem(index)
    for (const field in obj) {
      mem(obj, field)
      obj[field] = obj[field].bind(obj)
    }

    return obj
  }

  static action<O extends Record<string, Function>>(obj: O) {
    for (const field in obj) {
      remolAction(obj, field)
    }

    return obj
  }
}
