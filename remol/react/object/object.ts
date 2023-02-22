import React from 'react'

import { RemolContext, RemolObject } from '@remol/core'

import { useRemolContext } from '../context/context'

interface Make {
  make<Instance>(config: Partial<Instance>): Instance & {
    $: RemolContext
  }
}

export class RemolViewObject extends RemolObject {
  static use<Instance>(
    this: {
      new (): Instance
    },
    config: Partial<Instance>
  ): Instance {
    // eslint-disable-next-line
    const $ = useRemolContext()
    // eslint-disable-next-line
    return React.useMemo(
      () => {
        const obj = (this as unknown as Make).make<Instance>(config)
        obj.$ = $

        return obj
      },
      // eslint-disable-next-line
      []
    )
  }
}
