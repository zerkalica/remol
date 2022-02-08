export function remolFuncName<F extends Function & { displayName?: string }>(fn: F, name: string) {
  Object.defineProperty(fn, 'name', { value: name, writable: false })
  fn.displayName = name

  return fn as F & { displayName?: string }
}
