import { boundMethod } from 'autobind-decorator'
import { $mol_wire_fiber, $mol_wire_mem } from 'mol_wire_lib'

type EventFactoryDescriptor<Host, Args extends unknown[], Event, Result> = TypedPropertyDescriptor<
  (...args: Args) => (this: Host, e: Event) => Promise<Result>
>

export function remolEventFactory(argsCount: number) {
  return function remolEventFactoryDecorate<Host extends object, Args extends unknown[], Event, Result>(
    host: Host,
    field: keyof Host & (string | symbol),
    descr = Reflect.getOwnPropertyDescriptor(host, field) as undefined | EventFactoryDescriptor<Host, Args, Event, Result>
  ) {
    const orig: NonNullable<EventFactoryDescriptor<Host, Args, Event, Result>['value']> = descr?.value ?? (host[field] as any)

    function value(this: Host, ...args: Args) {
      let fiber: undefined | $mol_wire_fiber<Host, [Event], any>
      const handler = orig.call(this, ...args)

      return (e: Event) => {
        fiber?.destructor()
        fiber = $mol_wire_fiber.temp(this, handler, e)

        return fiber.async()
      }
    }

    const descr2 = $mol_wire_mem(argsCount)(host, field, { ...descr, value } as any)

    return boundMethod(host, field, descr2 as any) as typeof descr
  }
}
