import http, { IncomingMessage, ServerResponse } from 'http'
import serveStatic from 'serve-static'

import { RemolServerMiddleware } from './mdlCombine'

export class RemolBootServer {
  port() {
    return 8081
  }

  publicDir() {
    return undefined as undefined | string
  }

  protected bundlerMdl(): undefined | RemolServerMiddleware {
    return undefined
  }

  protected staticMdl(): undefined | RemolServerMiddleware {
    const publicDir = this.publicDir()

    return publicDir ? serveStatic(publicDir, { index: false }) : undefined
  }

  middleware(): RemolServerMiddleware | undefined {
    return this.bundlerMdl() ?? this.staticMdl()
  }

  protected serverCached: http.Server | undefined = undefined

  protected async process(reqRaw: IncomingMessage, resRaw: ServerResponse, e?: Error) {
    resRaw.writeHead(500, { 'Content-Type': 'application/json' })
    const body = JSON.stringify(e ?? 'Request not handlered')

    return resRaw.end(body)
  }

  protected server() {
    if (this.serverCached) return this.serverCached
    const mdl = this.middleware()

    this.serverCached = http.createServer((reqRaw, resRaw) => {
      const next = this.process.bind(this, reqRaw, resRaw)
      if (!mdl) return next()

      mdl(reqRaw, resRaw, next)
    })

    this.serverCached.once('error', this.fail.bind(this))

    return this.serverCached
  }

  start() {
    this.server().listen(this.port(), this.ready.bind(this))
  }

  protected fail(e: Error) {
    console.error(e)
  }

  protected ready() {
    console.log(
      `Server listening on \x1b[42m\x1b[1mhttp://localhost:` +
        `${this.port()}\x1b[0m in \x1b[41m` +
        `${process.env.NODE_ENV ?? 'empty'}\x1b[0m 🌎...`
    )
  }
}
