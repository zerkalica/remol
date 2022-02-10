import { boundMethod } from 'autobind-decorator'
import { $mol_wire_method } from 'mol_wire_lib'

export function remolAction<Host extends object, Args extends readonly unknown[], Result>(
  host: Host,
  field: PropertyKey,
  descr?: TypedPropertyDescriptor<(...args: Args) => Result>
) {
  const descr2 = $mol_wire_method(host, field, descr)
  return boundMethod(host, field as string | symbol, descr2) as typeof descr
}
