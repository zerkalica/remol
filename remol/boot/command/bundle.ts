import type { Argv, CommandModule } from 'yargs'
import { RemolBootBuild } from '../build/build'
import { RemolBootCommandContext } from './context'

export async function remolBootCommandBundle({ dev, distRoot, publicUrl }: RemolBootCommandContext) {
  const build = new RemolBootBuild()
  build.isDev = () => dev
  build.distRoot = () => distRoot
  build.publicUrl = () => publicUrl

  await build.bundle()
}

remolBootCommandBundle.yargs = {
  command: 'bundle',
  describe: 'Create bundle',
  handler: remolBootCommandBundle,
} as CommandModule<{}, Parameters<typeof remolBootCommandBundle>[0]>
