import path from 'path'
import yargs, { Argv } from 'yargs'

import { remolBootCommandBundle } from './bundle'
import { RemolBootCommandContext } from './context'
import { remolBootCommandDev } from './dev'

export async function remolBootCommand() {
  const yargs = await commandYargs()

  const commands = yargs.command(remolBootCommandBundle.yargs).command(remolBootCommandDev.yargs).help()

  const argv = await commands.parse()
  console.log(argv._[0], argv.lib ? 'library' : 'application', argv.projectDir)
  if (argv._.length === 0) commands.showHelp()
}

async function commandYargs() {
  const context: RemolBootCommandContext = { distRoot: path.join(process.cwd(), '-'), dev: true, publicUrl: '/' }

  return addContextOptions(yargs, context)
}

function addContextOptions(yargs: Argv, p: RemolBootCommandContext): Argv<RemolBootCommandContext> {
  return yargs
    .option('publicUrl', {
      type: 'string',
      default: p.publicUrl,
      description: 'Public url',
    })
    .option('distRoot', {
      type: 'string',
      default: p.distRoot,
      description: 'Build directory',
    })
    .option('dev', {
      type: 'boolean',
      default: p.dev,
      description: 'Enable development mode',
    })
}
