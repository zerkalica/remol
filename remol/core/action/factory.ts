import { boundMethod } from 'autobind-decorator'
import $, { $mol_wire_mem, $mol_wire_task } from 'mol_wire_lib'

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
      let prev: undefined | $mol_wire_task<Host, Args, void>

      const handler = orig.call(this, ...setup)
      const temp = $mol_wire_task.getter(handler)

      return (...args: Args) => {
        prev?.destructor()
        const fiber = temp(this, args)
        if ($.$mol_wire_auto()) return fiber.sync()
        prev = fiber

        return fiber.async() as unknown as void
      }
    }

    const descr2 = $mol_wire_mem(argsCount)(host, field as any, { ...descr, value })

    return boundMethod(host, field, descr2)
  }
}
