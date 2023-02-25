import { boundMethod } from 'autobind-decorator'

import { $mol_wire_method } from '../stub.js'

function bound<Host extends object, Args extends readonly any[]>(
  host: Host,
  field: PropertyKey & (symbol | string),
  descr?: TypedPropertyDescriptor<(...args: Args) => any>
) {
  return boundMethod(host, field, $mol_wire_method<Host, Args>(host, field, descr))
}

export const action = Object.assign($mol_wire_method, { bound })
