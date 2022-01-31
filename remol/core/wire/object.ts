import { $mol_wire_method, $mol_wire_mem, $mol_compare_deep, $mol_wire_pub_sub } from 'mol_wire_lib'

class RemolWirePubSub<V = unknown> extends $mol_wire_pub_sub {
  cache: V | undefined = undefined
}

export class RemolWireObject<V extends Object> {
  protected subs = new Map<string | symbol, RemolWirePubSub>()

  static decorate<O extends Record<string, Function>>(
    decorate: (host: O, field: keyof O, descr?: TypedPropertyDescriptor<any> | undefined) => void,
    obj: O
  ) {
    for (const field in obj) {
      decorate(obj, field)
      obj[field] = obj[field].bind(obj)
    }
  
    return obj
  }

  static mem<O extends Record<string, Function>>(obj: O, index = 0) {
    return this.decorate($mol_wire_mem(index), obj)
  }

  static action<O extends Record<string, Function>>(obj: O) {
    return this.decorate($mol_wire_method, obj)
  }

  static props<V extends Object>(v: V) {
    return new Proxy(v, new RemolWireObject<V>())
  }

  protected static updated = false
  static update<V extends Object>(v: V, next: V) {
    this.updated = false
    Object.assign(v, next)

    return this.updated
  }

  sub(t: V, key: (string | symbol) & keyof typeof t) {
    let sub = this.subs.get(key)
    if (sub === undefined) {
      sub = new RemolWirePubSub()
      sub.cache = t[key]
      this.subs.set(key, sub)
    }

    return sub
  }

  get(t: V, key: (string | symbol) & keyof typeof t) {
    const sub = this.sub(t, key)

    sub.track_promote()

    return sub.cache
  }

  set(t: V, key: (string | symbol) & keyof typeof t, value: any) {
    const sub = this.sub(t, key)
    if (! $mol_compare_deep(value, sub.cache)) {
      sub.cache = value
      RemolWireObject.updated = true
      sub.emit()
    }

    return true
  }
}
