import { remolFuncName } from '../func/name.js'

export function remolMiddlewareAsync<Req, Res>(cb: (req: Req, res: Res, next: (e?: any) => unknown) => Promise<unknown>) {
  return remolFuncName(async (req: Req, res: Res, next: (e?: any) => unknown) => {
    try {
      await cb(req, res, next)
    } catch (e) {
      next(e)
    }
  }, cb.name + 'remolMiddlewareAsync')
}
