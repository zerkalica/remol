import { $mol_wire_auto } from 'mol_wire_lib'

import { RemolContext } from './context'

export class RemolContextObject extends Object {
  constructor(protected $ = RemolContext.instance, id = $mol_wire_auto()?.toString()) {
    super()

    this[Symbol.toStringTag] = id ?? this.constructor.name
  }

  [Symbol.toStringTag]: string
}
