import type { Argv } from 'yargs'
import { RemolBootBuild } from '../build/build'
import { RemolBootCommandContext } from './context'

export async function remolBootCommandBundle({ dev, distRoot }: RemolBootCommandContext) {
  const build = new RemolBootBuild()
  build.isDev = () => dev
  build.distRoot = () => distRoot

  await build.bundle()
}

remolBootCommandBundle.yargs = {
  command: 'bundle',
  describe: 'Create bundle',
  handler: remolBootCommandBundle,
}
