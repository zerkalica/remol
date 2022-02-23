import { $mol_wire_auto, $mol_wire_fiber } from 'mol_wire_lib'

const hop = Object.prototype.hasOwnProperty

export class RemolWireProps<Props extends Record<string | symbol, unknown>> extends Object {
  constructor(protected props: Props) {
    super()
    this.fibers = {}
    for (let key in props) {
      this.fibers[key] = undefined
    }
    this.proxy = new Proxy<Props>(props, this)
  }

  protected last: Props | undefined = undefined
  protected proxy: Props
  protected fibers: Record<string | symbol, $mol_wire_fiber<null, unknown[], unknown> | undefined>

  get(t: Props, key: string | symbol) {
    const fiber = this.fibers[key]

    if (fiber === undefined) return t[key]

    return fiber.sync()
  }

  update(next: Props) {
    if (next === this.last) return this.proxy
    this.last = next
    const prev = $mol_wire_auto()

    $mol_wire_auto(null)

    const keys = Object.keys(next)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const fiber = this.fibers[key] ?? (this.fibers[key] = new $mol_wire_fiber(key, pass, null))
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
