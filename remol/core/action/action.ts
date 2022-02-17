import { boundMethod } from 'autobind-decorator'
import $, { $mol_wire_fiber } from 'mol_wire_lib'

import { remolActionFactory } from './factory'

export function remolAction<Host extends object, Args extends unknown[], Result>(
  host: Host,
  field: keyof Host & (string | symbol),
  descr = Reflect.getOwnPropertyDescriptor(host, field) as undefined | TypedPropertyDescriptor<(this: Host, ...args: Args) => any>
) {
  const orig = descr?.value ?? (host[field] as unknown as (this: Host, ...e: Args) => Result)

  const fibers = new WeakMap<Host, $mol_wire_fiber<Host, Args, Result>>()

  function value(this: Host, ...args: Args) {
    fibers.get(this)?.destructor()
    const fiber = $mol_wire_fiber.temp(this, orig, ...args)

    if ($.$mol_wire_auto()) return fiber.sync()

    fibers.set(this, fiber)

    return fiber.up() as unknown as Result
  }

  const descr2 = { ...descr, value }

  return boundMethod(host, field, descr2)
}

remolAction.factory = remolActionFactory(1)
