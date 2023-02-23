import { RemolObject } from '../object/object.js'

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

export class RemolContext extends RemolObject {
  constructor(protected registry = new Map<RemolContextValue, unknown>()) {
    super()
  }

  clone(id?: string) {
    const ctx = new RemolContext(new Map(this.registry))
    if (id) ctx[Symbol.toStringTag] = id
    return ctx
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
}

RemolObject.$ = RemolContext.single()
