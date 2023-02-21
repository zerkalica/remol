import type { Argv, CommandModule } from 'yargs'
import { RemolBootBuild } from '../build/build'
import { RemolBootServer } from '../server/server'
import { RemolBootCommandContext } from './context'

export async function remolBootCommandDev({
  dev,
  distRoot,
  port = 8081,
  publicUrl,
}: RemolBootCommandContext & { port?: number }) {
  const build = new RemolBootBuild()
  build.isDev = () => dev
  build.distRoot = () => distRoot
  build.publicUrl = () => publicUrl

  const server = new RemolBootServer()
  server.middleware = () => build.middleware()
  server.port = () => port
  server.start()
}

remolBootCommandDev.yargs = {
  command: 'dev',
  describe: 'Run dev server',
  handler: remolBootCommandDev,
  builder: <V extends RemolBootCommandContext>(y: Argv<V>) =>
    y.option('port', {
      type: 'number',
      default: 8081,
      description: 'Dev server port',
    }),
} as CommandModule<{}, Parameters<typeof remolBootCommandDev>[0]>
