import { boundMethod } from 'autobind-decorator'
import { $mol_key, $mol_wire_fiber, $mol_wire_method } from 'mol_wire_lib'

export function remolAction<Host extends object, Args extends readonly unknown[], Result>(
  host: Host,
  field: keyof Host & (string | symbol),
  descr?: TypedPropertyDescriptor<(...args: Args) => any>
) {
  const descr2 = $mol_wire_method(host, field, descr)

  return boundMethod(host, field, descr2)
}
type EventHandler<Event, Result> = (e: Event) => Result extends Promise<unknown> ? Result : Promise<Result>

type EventHandlerFactoryFunc<Func> = Func extends () => infer Result
  ? () => EventHandler<unknown, Result>
  : Func extends (...a: [...infer Setup, infer Event]) => infer Result
  ? (...a: Setup) => EventHandler<Event, Result>
  : never

type EventHandlerFactoryHost<Host extends object> = {
  [key in keyof Host]: Host[key] extends Function ? EventHandlerFactoryFunc<Host[key]> : never
}

function remolEventHandlerFactory<Host extends Record<string | symbol, unknown>, Setup extends unknown[], Event, Result>(
  this: Host,
  field: keyof Host,
  prev: Map<string, (e: Event) => Promise<Result>>,
  ...setup: Setup
): (e: Event) => Promise<Result> {
  const key = $mol_key(setup)
  let handler = prev.get(key)

  if (handler) return handler

  let fiber: undefined | $mol_wire_fiber<Host, [...Setup, Event], Result>

  handler = (e: Event) => {
    fiber?.destructor()
    fiber = $mol_wire_fiber.temp(
      this,
      this[field] as unknown as (this: Host, ...args: [...Setup, Event]) => Result,
      ...[...setup, e]
    )

    return fiber.async()
  }

  prev.set(key, handler)

  return handler
}

class WireAsyncProxyHandler<Host extends Record<string | symbol, any>> {
  protected cache = new Map<keyof Host, Function>()

  get(host: Host, field: keyof Host) {
    if (typeof host[field] !== 'function') return host[field]
    let memo = this.cache.get(field)

    if (memo === undefined) {
      memo = remolEventHandlerFactory.bind(host, field as string, new Map())
      this.cache.set(field, memo)
    }

    return memo
  }
}

export function remolEventHandlers<Host extends Record<string | symbol, any>>(obj: Host) {
  return new Proxy<EventHandlerFactoryHost<Host>>(obj, new WireAsyncProxyHandler<Host>())
}
