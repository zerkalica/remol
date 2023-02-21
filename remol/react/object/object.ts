import React from 'react'

import { RemolObject } from '@remol/core'

import { useRemolContext } from '../context/context'

interface Make {
  make<Instance>(config: Partial<Instance>): Instance
}

export class RemolViewObject extends RemolObject {
  static use<Instance>(
    this: {
      new (): Instance
    },
    config: Partial<Instance>
  ): Instance {
    // eslint-disable-next-line
    const _ = useRemolContext()
    // eslint-disable-next-line
    return React.useMemo(
      () =>
        (this as unknown as Make).make<Instance>({
          _,
          ...config,
        }),
      // eslint-disable-next-line
      []
    )
  }
}
