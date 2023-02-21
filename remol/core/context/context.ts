import { $mol_object, $mol_wire_atom, $mol_wire_auto } from 'mol_wire_lib'

type ReactLikeContext<V> = {
  _currentValue?: V
  $$typeof: Symbol
  Provider(p: { value: V; children: any }): unknown
}

export type RemolContextValue = Object | Function

type RemolContextKey<V extends RemolContextValue> = ReactLikeContext<V> | V

function isReactContext<V>(v: any): v is ReactLikeContext<V> {
  return typeof v === 'object' && typeof v.$$typeof === 'symbol' && typeof v.Provider === 'function'
}

export class RemolContext extends $mol_object {
  constructor(protected registry = new Map<RemolContextValue, unknown>(), id = RemolContext.id) {
    super()
    this[Symbol.toStringTag] = id ?? this.constructor.name
  }

  [Symbol.toStringTag]!: string

  clone(id?: string) {
    return new RemolContext(new Map(this.registry), id)
  }

  set<V extends RemolContextValue>(p: V, v: RemolContextKey<V>) {
    if (v === null) throw new Error(`null value not allowed for ${String(p)}`)
    this.registry.set(p, v)

    return this
  }

  get<V extends RemolContextValue>(p: RemolContextKey<V>) {
    const dep = this.opt(p)
    if (dep === undefined) {
      throw new Error(`RemolContext, provide value for ${String(p)}`)
    }

    return dep
  }

  opt<V extends RemolContextValue>(p: RemolContextKey<V>) {
    const dep = this.registry.get(p) as undefined | V

    if (dep !== undefined) return dep

    if (isReactContext<V>(p)) return p._currentValue

    return p
  }

  protected static $$: RemolContext | undefined = undefined

  static get instance() {
    const owner = $mol_wire_auto()

    if (owner instanceof $mol_wire_atom) {
      const $ = (owner.host as { $$?: RemolContext }).$$
      if ($ instanceof RemolContext) return $
    }

    if (!this.$$) this.$$ = new RemolContext()

    return this.$$
  }

  static get id() {
    return $mol_wire_auto()?.toString() + '#'
  }
}
