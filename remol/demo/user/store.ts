import { mem } from '@remol/core'

import { RemolDemoFetch } from '../fetch/fetch'

export interface RemolDemoUserDTO {
  first_name: string
}

export class RemolDemoUserStore {
  @mem(1) user(id: string, next?: RemolDemoUserDTO) {
    if (next) {
      console.log('saving user')
      return next // PUT to server
    }
    return RemolDemoFetch.response(`https://reqres.in/api/users/${id}?delay=1`).json().data as RemolDemoUserDTO
  }
}
