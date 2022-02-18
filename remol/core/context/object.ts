import { RemolContext } from './context'

export class RemolContextObject extends Object {
  constructor(protected $ = RemolContext.instance, id = RemolContext.id) {
    super()

    this[Symbol.toStringTag] = id ?? this.constructor.name
  }

  [Symbol.toStringTag]: string
}
