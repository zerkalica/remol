import { RemolWireFunc } from './func'

describe('RemolWireFunc', () => {
  it('field', () => {
    const some = { b: 1 }

    const obj = { id: 'some', a: some }
    const proxy = RemolWireFunc.field({ ...obj })

    expect(proxy.a).toEqual(some)
  })
})
