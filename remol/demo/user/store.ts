import { mem, RemolContext } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

export interface RemolDemoUserDTO {
  first_name: string
}

export class RemolDemoUserStore {
  constructor(protected $ = RemolContext.instance, protected fetch = $.get(RemolDemoFetch)) {}
  @mem(1) user(id: string, next?: RemolDemoUserDTO) {
    if (next) {
      console.log('saving user')
      return next // PUT to server
    }
    return this.fetch.response(`https://reqres.in/api/users/${id}?delay=1`).json().data as RemolDemoUserDTO
  }
}
