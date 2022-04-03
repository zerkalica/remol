import { $mol_wire_atom, $mol_wire_auto } from 'mol_wire_lib'

type ReactLikeContext<V> = {
  _currentValue?: V
  $$typeof: Symbol
  Provider(p: { value: V; children: any }): unknown
}

type RemolContextValue = Object | Function

export type RemolContextKey<V extends RemolContextValue = RemolContextValue> = ReactLikeContext<V> | V

export class RemolContext extends Object {
  protected registry: Map<RemolContextKey, unknown> | undefined = undefined

  constructor(protected parent?: RemolContext, id = RemolContext.id) {
    super()
    this[Symbol.toStringTag] = id ?? this.constructor.name
  }

  [Symbol.toStringTag]: string

  clone(id?: string) {
    return new RemolContext(this, id)
  }

  static clone(id?: string) {
    return new RemolContext(RemolContext.instance, id)
  }

  get isChanged() {
    return this.changed
  }

  protected changed = false

  set<V extends RemolContextValue>(p: RemolContextKey<V>, v: V) {
    if (v === null) throw new Error(`null value not allowed for ${p}`)

    const prev = this.parent?.opt<V>(p)
    if (prev === v) return this

    if (this.registry === undefined) {
      this.registry = this.parent?.registry === undefined ? new Map() : new Map(this.parent.registry)
    }
    this.registry.set(p, v)
    this.changed = true

    return this
  }

  get<V>(p: RemolContextKey<V>) {
    const dep = this.opt(p)
    if (dep === undefined) throw new Error(`RemolContext, provide value for ${p}`)

    return dep
  }

  opt<V>(p: RemolContextKey<V>) {
    if (this.registry === undefined && this.parent?.registry !== undefined) this.registry = new Map(this.parent.registry)
    const dep = this.registry?.get(p) as V | undefined
    if (dep !== undefined) return dep

    if (isReactContext<V>(p)) return p._currentValue

    return p
  }

  static cache: RemolContext | undefined = undefined

  static get instance() {
    const owner = $mol_wire_auto()

    if (owner instanceof $mol_wire_atom) {
      const $ = (owner.host as { $?: RemolContext }).$
      if ($) return $
    }

    return (this.cache = this.cache ?? new RemolContext())
  }

  static get id() {
    return $mol_wire_auto()?.toString() + '#'
  }
}

function isReactContext<V>(v: any): v is ReactLikeContext<V> {
  return typeof v === 'object' && typeof v.$$typeof === 'symbol' && typeof v.Provider === 'function'
}
