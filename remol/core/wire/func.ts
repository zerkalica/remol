import { $mol_wire_auto, $mol_wire_mem } from 'mol_wire_lib'

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

  static field<O extends Record<string, unknown>>(obj: O) {
    return PropProxyHandler.wrap(obj)
  }
}

class PropProxyHandler<Props extends Record<string | symbol, unknown>> {
  static wrap<Props extends Record<string | symbol, unknown>>(props: Props) {
    return new Proxy<Props>(props, new PropProxyHandler<Props>())
  }

  @$mol_wire_mem(1) prop(key: keyof Props, next?: Props[keyof Props]) {
    return next
  }

  get(t: Props, key: keyof Props) {
    const value = this.prop(key)
    return value !== undefined ? value : t[key]
  }

  set(t: Props, key: keyof Props, value: Props[keyof Props]) {
    const prev = $mol_wire_auto()

    try {
      $mol_wire_auto(null)
      this.prop(key, value)
    } finally {
      $mol_wire_auto(prev)
    }

    return true
  }
}
