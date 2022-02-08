import { remolFuncName } from './name'

describe('remolFuncName', () => {
  it('copy name to displayName', () => {
    function test() {}
    const t = remolFuncName(test, 'test2')
    expect(t.name).toEqual('test2')
    expect(t.displayName).toEqual('test2')
  })
})
