import { $mol_wire_field, $mol_wire_method, $mol_wire_mem } from 'mol_wire_lib'

export class RemolWireFunc {
  static normalize<F extends Function & { displayName?: string }>(fn: F, name: string): F {
    Object.defineProperty(fn, 'name', { value: name, writable: false })
    fn.displayName = name
  
    return fn
  }

  static mem<O extends Record<string, Function>>(obj: O, index = 0) {
    const mem = $mol_wire_mem(index)
    for (const field in obj) {
      mem(obj, field)
      obj[field] = obj[field].bind(obj)
    }

    return obj
  }

  static action<O extends Record<string, Function>>(obj: O) {
    for (const field in obj) {
      $mol_wire_method(obj, field)
      obj[field] = obj[field].bind(obj)
    }

    return obj
  }

  static field<O extends Record<string, unknown>>(obj: O) {
    for (const field in obj) {
      $mol_wire_field(obj, field)
    }
    return obj
  }
}
