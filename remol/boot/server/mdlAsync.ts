export function remolServerMdlAsync<Req, Res>(cb: (req: Req, res: Res, next: (e?: any) => unknown) => Promise<unknown>) {
  return async (req: Req, res: Res, next: (e?: any) => unknown) => {
    try {
      await cb(req, res, next)
    } catch (e) {
      next(e)
    }
  }
}
