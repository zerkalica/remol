import path from 'path'
import ts, { ParsedCommandLine } from 'typescript'

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
}

export function remolBootInfoTsConfigFind(directory: string, configName = 'tsconfig.json') {
  return ts.findConfigFile(directory, ts.sys.fileExists, configName)
}

const cache = new Map<string, ParsedCommandLine>()

export function remolBootInfoTsConfig(configPath: string) {
  let params = cache.get(configPath)
  if (!params) {
    const rec = ts.readConfigFile(configPath, ts.sys.readFile)
    if (rec.error) throw new Error(ts.formatDiagnostic(rec.error, formatHost))
    params = ts.parseJsonConfigFileContent(rec.config, ts.sys, path.dirname(configPath), undefined, configPath)
    cache.set(configPath, params)
  }

  return params
}
