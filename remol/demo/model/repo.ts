import { action, plex, RemolObject } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch.js'

export class RemolDemoModelRepo<DTO> extends RemolObject {
  get fetcher() {
    return this.ctx(RemolDemoFetch)
  }

  @action prefetch(ids: readonly string[]) {
    const ids_to_fetch = ids.filter(id => !this.dto_prefetched(id))
    if (!ids_to_fetch.length) return

    const items = this.get(ids_to_fetch)

    Object.keys(items).forEach(id => this.dto_prefetched(id, items[id]))
  }

  protected get(ids: readonly string[]) {
    return {} as Record<string, DTO | undefined>
  }

  protected patch(rec: Record<string, Partial<DTO> | null | undefined>) {
    return {} as Record<string, DTO | undefined>
  }

  @plex dto_prefetched(id: string, next?: DTO) {
    return next
  }

  @plex dto(id: string, next?: Partial<DTO> | null) {
    if (next || next === null) return this.patch({ [id]: next })[id] ?? {}

    const dto = this.dto_prefetched(id) ?? this.dto_prefetched(id, this.get([id])[id])
    if (!dto) throw new Error('Cant prefetch todo id=' + id)

    return dto
  }

  fetch(url: string, init: RequestInit) {
    const res = this.fetcher.response(url, init).json() as { data: { ids: string[] } }
    return res
  }
}
