import { $mol_object, $mol_wire_plex, $mol_wire_solo } from '../stub.js'

const solo = $mol_wire_solo
const plex = $mol_wire_plex

export type RemolBoxProps<Props> = {
  [K in keyof Props]?: Props[K] extends () => infer Result ? Props[K] | Result : Props[K]
}

type RemolProp<Orig> = NonNullable<Orig> extends Function
  ? NonNullable<Orig> & {
      defined: boolean
    }
  : NonNullable<Orig> extends symbol
  ? Orig
  : () => NonNullable<Orig> | Orig

type RemolProps<Props extends {}> = {
  [K in keyof Props]-?: RemolProp<Props[K]>
}

export class RemolBox<Props extends { id?: string | (() => string) }> extends $mol_object {
  constructor(protected _props: Props) {
    super()

    const id = typeof _props.id === 'function' ? _props.id() : _props.id

    this[Symbol.toStringTag] = id ?? this.constructor.name
  }

  [Symbol.toStringTag]!: string

  @solo props(props = this._props) {
    this._props = props
    return props
  }

  update(nextRaw: Props) {
    const current = this._props
    return this.props(nextRaw) !== current
  }

  @plex prop<K extends keyof Props>(key: K): Props[K] {
    return this.props()[key]
  }

  @plex box<K extends keyof Props>(key: K) {
    const box = (...args: unknown[]) => {
      const prop = this._props[key] as any

      if (typeof prop !== 'function' && args.length === 0) {
        return this.prop(key)
      }

      return prop?.(...args)
    }

    Object.defineProperty(box, 'defined', {
      get: () => this.prop(key) !== undefined,
    })

    return box as unknown as RemolProp<K>
  }

  @solo propKeys(next?: (keyof Props & string)[]) {
    return Object.keys(this.props())
  }

  propsProxy = new Proxy({} as RemolProps<Props>, this)

  get(t: RemolProps<Props>, k: keyof Props & (symbol | string)) {
    if (k === 'constructor' || k === '__proto__') return this._props[k]
    return this.box(k)
  }

  has(t: RemolProps<Props>, k: keyof Props & (symbol | string)) {
    if (k === 'constructor' || k === '__proto__') return false
    return true
  }

  getOwnPropertyDescriptor(t: RemolProps<Props>, k: keyof Props & (symbol | string)) {
    return {
      value: this.box(k),
      enumerable: true,
      configurable: true,
    }
  }

  ownKeys(t: RemolProps<Props>) {
    return this.propKeys()
  }
}
