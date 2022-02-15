import { $mol_wire_fiber, $mol_wire_field } from 'mol_wire_lib'

import { RemolWire } from './wire'

describe('RemolWire', () => {
  it('no cache task', () => {
    const host = {
      node: jest.fn(),
      update: jest.fn(),
    }
    const wire = new RemolWire(host)
    wire.sync()
    wire.sync()
    expect(host.node).toHaveBeenCalledTimes(2)
  })

  it('update inner deps', async () => {
    class TestMems {
      @$mol_wire_field
      static some = 1
    }

    const update = jest.fn()
    const wire = new RemolWire({
      node() {
        return 123 + TestMems.some
      },
      update,
    })
    expect(wire.sync()).toEqual(124)

    await new $mol_wire_fiber(
      null,
      () => {
        TestMems.some++
        return 1
      },
      'fiber'
    ).async()

    expect(update).toHaveBeenCalledTimes(1)
  })
})
