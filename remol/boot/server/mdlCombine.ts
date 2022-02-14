import { IncomingMessage, ServerResponse } from 'http'

export type RemolServerMiddleware = (req: IncomingMessage, res: ServerResponse, next: (err?: any) => any) => void

export function remolServerMdlCombine(...mids: readonly (RemolServerMiddleware | undefined | null)[]) {
  return mids
    .filter(<M>(mdl?: M | null): mdl is M => Boolean(mdl))
    .reduce((a, b) => {
      return (req, res, next) => {
        try {
          a(req, res, err => {
            if (err) return next(err)

            try {
              b(req, res, next)
            } catch (err) {
              next(err)
            }
          })
        } catch (err) {
          next(err)
        }
      }
    })
}
