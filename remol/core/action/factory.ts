import { boundMethod } from 'autobind-decorator'
import $, { $mol_wire_fiber, $mol_wire_mem } from 'mol_wire_lib'

export function remolActionFactory(argsCount: number) {
  return function remolActionFactoryDecorate<Host extends object, Setup extends unknown[], Args extends unknown[]>(
    host: Host,
    field: keyof Host & (string | symbol),
    descr = Reflect.getOwnPropertyDescriptor(host, field) as
      | undefined
      | TypedPropertyDescriptor<(...setup: Setup) => (this: Host, ...args: Args) => void>
  ) {
    const orig = descr?.value ?? (host[field] as unknown as (...setup: Setup) => (this: Host, ...args: Args) => void)

    function value(this: Host, ...setup: Setup) {
      let prev: undefined | $mol_wire_fiber<Host, Args, void>
      const handler = orig.call(this, ...setup)

      return (...args: Args) => {
        prev?.destructor()
        const fiber = $mol_wire_fiber.temp(this, handler, ...args)
        if ($.$mol_wire_auto()) return fiber.sync()
        prev = fiber

        return fiber.async() as unknown as void
      }
    }

    const descr2 = $mol_wire_mem(argsCount)(host, field as any, { ...descr, value })

    return boundMethod(host, field, descr2)
  }
}
