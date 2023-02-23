import { RemolBootBuild } from './build.js'

describe('build', () => {
  it('dummy', () => {
    const build = new RemolBootBuild()
    expect(build).toBeInstanceOf(RemolBootBuild)
  })
})
