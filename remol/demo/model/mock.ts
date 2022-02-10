declare var crypto: {
  randomUUID(): string
}

export abstract class RemolDemoStoreMock<DTO extends { id: string }> extends Object {
  protected cache = undefined as Record<string, DTO> | undefined

  max() {
    return 5
  }

  get items() {
    if (this.cache) return this.cache

    const cache = (this.cache = {} as Record<string, DTO>)

    for (let i = 0; i < this.max(); i++) {
      const id = crypto.randomUUID()
      cache[id] = this.create(id)
    }

    return cache
  }

  abstract create(id: string): DTO

  list(filter?: unknown) {
    return { data: { ids: Object.keys(this.items) } }
  }

  get(ids: readonly string[]) {
    const data = {} as typeof this.items
    for (const id of ids) data[id] = this.items[id]

    return { data }
  }

  patch(obj: Record<string, DTO | null>) {
    const data = {} as typeof obj
    for (let id in obj) {
      if (obj[id] === null) {
        delete this.items[id]
        continue
      }
      Object.assign(this.items[id], obj[id])
      data[id] = this.items[id]
    }
    return { data }
  }
}
