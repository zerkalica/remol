import React from 'react'

import { RemolContext } from '@remol/core'

export const RemolContextReact = React.createContext(RemolContext.instance)
RemolContextReact.displayName = 'RemolReactContext'

export function useRemolContext() {
  return React.useContext(RemolContextReact)
}
