import { AsyncLocalStorage } from 'async_hooks'

import { remolMiddlewareAsync } from '../middleware/async'
import { RemolContext } from './context'

const store = new AsyncLocalStorage<RemolContext>()

export function useRemolContextNode(def = RemolContext.single()) {
  return store.getStore() ?? def
}

export function remolContextNode<In, Out>(initContext: (req: In, res: Out, ctx: RemolContext) => Promise<RemolContext>) {
  return remolMiddlewareAsync(async function remolContextNode$(req: In, res: Out, next: () => any) {
    const parent$ = useRemolContextNode()
    const $ = parent$.clone()
    await initContext(req, res, $)

    return store.run($, next)
  })
}
