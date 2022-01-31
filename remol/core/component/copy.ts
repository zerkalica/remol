// based on https://github.com/mridgway/hoist-non-react-statics/blob/master/src/index.js
const hoistBlackList = {
  $$typeof: true,
  render: true,
  compare: true,
  type: true,
}

export function remolComponentCopy<A extends Function, B extends Function>(base: A, target: B) {
  const keys = Object.keys(base)
  keys.push('name')
  keys.push('displayName')

  for (const key of keys) {
    if (hoistBlackList[key as keyof typeof hoistBlackList]) continue
    const desc = Object.getOwnPropertyDescriptor(base, key)
    if (!desc) continue
    Object.defineProperty(target, key, desc)
  }

  return target
}
