import { $mol_wire_auto, $mol_wire_fiber } from 'mol_wire_lib'

const hop = Object.prototype.hasOwnProperty

export class RemolWireProps<Props extends Record<string | symbol, unknown>> extends Object {
  constructor(protected props: Props) {
    super()
    this.fibers = {}
    for (let key in props) {
      this.fibers[key] = undefined
    }
  }

  protected proxy = new Proxy<Props>(this.props, this)
  protected fibers: Record<string | symbol, $mol_wire_fiber<null, unknown[], unknown> | undefined>

  get(t: Props, key: string | symbol) {
    return this.fibers[key]?.sync()
  }

  update(next: Props) {
    const keys = Object.keys(next)
    const prev = $mol_wire_auto()

    $mol_wire_auto(null)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fiber = this.fibers[key] ?? (this.fibers[key] = new $mol_wire_fiber(null, pass, key))
      fiber.put(next[key])
    }

    const fiber_keys = Object.keys(this.fibers)

    for (let i = 0; i < fiber_keys.length; i++) {
      const key = fiber_keys[i]
      if (hop.call(next, key)) continue

      this.fibers[key]?.destructor()
      this.fibers[key] = undefined
    }

    $mol_wire_auto(prev)

    return this.proxy
  }
}

function pass<V>(v?: V) {
  return v
}
