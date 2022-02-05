import { $mol_after_frame, $mol_wire_pub, $mol_wire_cursor, $mol_wire_pub_sub as pub_sub } from 'mol_wire_lib'

export interface RemolWireHost<E> {
  node(): E | null
  update(): void
}

export class RemolWire<E> extends pub_sub {
  constructor(protected host: RemolWireHost<E>) {
    super()
  }

  update() {
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

  frame = undefined as undefined | $mol_after_frame

  scheduleUpdate() {
    if (this.frame) return
    this.frame = new $mol_after_frame(this.update.bind(this))
  }

  up() {
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
    this.track_promote()
    return this.up()
  }

  affect(quant: number) {
    if (super.affect(quant)) {
      this.scheduleUpdate()
      return true
    }
    return false
  }
}
