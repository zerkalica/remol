import React from 'react'

import { RemolBox } from '@remol/core'

export class RemolViewBox<Props extends {}> extends RemolBox<Props> {
  static use<Obj extends {}>(ctx: Obj) {
    // eslint-disable-next-line
    const wireCtx = React.useMemo(() => new RemolBox(ctx), [])
    wireCtx.update(ctx)

    return wireCtx.propsProxy
  }
}
