import path from 'path'
import yargs, { Argv } from 'yargs'
import { hideBin } from 'yargs/helpers'

import { remolBootCommandBundle } from './bundle.js'
import { RemolBootCommandContext } from './context.js'
import { remolBootCommandDev } from './dev.js'

export async function remolBootCommand() {
  const yargs = await commandYargs()

  const commands = yargs.command(remolBootCommandBundle.yargs).command(remolBootCommandDev.yargs).help()

  const argv = await commands.parse()
  if (argv._.length === 0) commands.showHelp()
  commands.scriptName
}

async function commandYargs() {
  const context: RemolBootCommandContext = {
    distRoot: path.join(process.cwd(), '-'),
    dev: process.env.NODE_ENV !== 'production',
    publicUrl: '/',
  }

  return addContextOptions(yargs(hideBin(process.argv), process.cwd()), context)
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
