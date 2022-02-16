import { $mol_wire_cursor, $mol_wire_pub, $mol_wire_pub_sub } from 'mol_wire_lib'

export interface RemolWireHost<E> {
  node(): E | null
  update(): void
}

export class RemolWire<E> extends $mol_wire_pub_sub {
  constructor(protected host: RemolWireHost<E>, id: string) {
    super()
    this[Symbol.toStringTag] = id
  }

  [Symbol.toStringTag]: string

  update() {
    if (this.frame === undefined) return
    this.frame = undefined

    if (this.cursor === $mol_wire_cursor.fresh) return
    if (this.cursor === $mol_wire_cursor.final) return

    check: if (this.cursor === $mol_wire_cursor.doubt) {
      for (let i = this.pub_from; i < this.sub_from; i += 2) {
        ;(this[i] as $mol_wire_pub)?.up()
        if (this.cursor !== $mol_wire_cursor.doubt) break check
      }

      this.cursor = $mol_wire_cursor.fresh
      return
    }

    this.host.update()
  }

  frame = undefined as undefined | Promise<void>

  schedule() {
    return Promise.resolve().then(this.update.bind(this))
  }

  override up() {
    const bu = this.track_on()
    try {
      const result = this.host.node()
      this.track_cut()
      return result
    } finally {
      this.track_off(bu)
    }
  }

  sync() {
    this.promote()
    return this.up()
  }

  override emit(quant: number) {
    super.emit(quant)

    if (this.frame === undefined) this.frame = this.schedule()
  }
}
