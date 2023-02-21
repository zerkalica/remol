import React from 'react'

import { RemolContext } from '@remol/core'

const RemolReactContext = React.createContext(RemolContext.instance)

export const RemolContextProvide = RemolReactContext.Provider
export const useRemolContext = () => React.useContext(RemolReactContext)
