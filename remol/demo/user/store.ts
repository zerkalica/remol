import { plex, RemolContext, RemolObject } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

export interface RemolDemoUserDTO {
  first_name: string
}

export class RemolDemoUserStore extends RemolObject {
  get fetcher() {
    return this.ctx(RemolDemoFetch)
  }

  @plex user(id: string, next?: RemolDemoUserDTO) {
    if (next) {
      console.log('saving user')
      return next // PUT to server
    }
    return this.fetcher.response(`https://reqres.in/api/users/${id}?delay=1`).json().data as RemolDemoUserDTO
  }
}
