export class RemolActionQueue extends Object {
  constructor(id: string) {
    super()
    this[Symbol.toStringTag] = id
  }

  [Symbol.toStringTag]: string

  run(cb: () => void) {}
}
