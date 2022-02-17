import { $mol_wire_fiber, $mol_wire_field } from 'mol_wire_lib'

import { RemolWire } from './wire'

describe('RemolWire', () => {
  it('cache task', () => {
    const host = {
      node: jest.fn(),
      up: jest.fn(),
    }
    const wire = new RemolWire(host, '1')
    wire.sync()
    wire.sync()
    RemolWire.rewind()
    expect(host.node).toHaveBeenCalledTimes(1)
  })

  it('update inner deps', async () => {
    class TestMems {
      @$mol_wire_field
      static some = 1
    }

    const up = jest.fn()
    const wire = new RemolWire(
      {
        node() {
          return 123 + TestMems.some
        },
        up: up,
      },
      'test'
    )
    expect(wire.sync()).toEqual(124)

    await new $mol_wire_fiber(
      null,
      () => {
        TestMems.some++
        return 1
      },
      'fiber'
    ).async()
    RemolWire.rewind()

    expect(up).toHaveBeenCalledTimes(1)
  })
})
