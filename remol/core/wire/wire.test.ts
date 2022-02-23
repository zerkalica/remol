import { $mol_wire_fiber, $mol_wire_field } from 'mol_wire_lib'

import { RemolSchedule } from '../schedule/schedule'
import { RemolWire } from './wire'

describe('RemolWire', () => {
  it('cache task', () => {
    const host = {
      node: jest.fn(),
      up: jest.fn(),
    }
    const wire = new RemolWire(host, '1')
    wire.sync()
    RemolSchedule.schedule_sync()
    wire.sync()
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

    RemolSchedule.schedule_sync()
    await new $mol_wire_fiber(
      'fiber',
      () => {
        TestMems.some++
        return 1
      },
      null
    ).async()

    expect(up).toHaveBeenCalledTimes(1)
  })
})
