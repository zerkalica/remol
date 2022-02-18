import { boundMethod } from 'autobind-decorator'
import $, { $mol_wire_fiber } from 'mol_wire_lib'

import { RemolSchedule } from '../schedule/schedule'
import { remolActionFactory } from './factory'

export function remolAction<Host extends object, Args extends unknown[], Result>(
  host: Host,
  field: keyof Host & (string | symbol),
  descr = Reflect.getOwnPropertyDescriptor(host, field) as
    | undefined
    | TypedPropertyDescriptor<(this: Host, ...args: Args) => any>,
  isSync?: boolean
) {
  const handler = descr?.value ?? (host[field] as unknown as (this: Host, ...e: Args) => Result)
  let orig = handler

  if (isSync) {
    orig = function (this: Host, ...e: Args): Result {
      const result = handler.call(this, ...e)
      RemolSchedule.schedule_sync()
      return result
    }
    Object.defineProperty(orig, 'name', {
      value: handler.name,
    })
  }

  const fibers = new WeakMap<Host, $mol_wire_fiber<Host, Args, Result>>()

  function value(this: Host, ...args: Args) {
    fibers.get(this)?.destructor()
    const fiber = $mol_wire_fiber.temp(this, orig, ...args)

    if ($.$mol_wire_auto()) return fiber.sync()

    fibers.set(this, fiber)

    return fiber.async() as unknown as Result
  }

  const descr2 = { ...descr, value }

  return boundMethod(host, field, descr2)
}

function remolActionSync<Host extends object, Args extends unknown[], Result>(
  host: Host,
  field: keyof Host & (string | symbol),
  descr = Reflect.getOwnPropertyDescriptor(host, field) as undefined | TypedPropertyDescriptor<(this: Host, ...args: Args) => any>
) {
  return remolAction(host, field, descr, true)
}

remolAction.sync = remolActionSync

remolAction.factory = remolActionFactory(1)
