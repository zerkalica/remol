import React from 'react'

import { remolCompareDeep, remolComponentCopy, RemolContext, RemolError, remolFail, RemolWire, RemolWireFunc, RemolWireHost } from '@remol/core'

import { RemolFallback } from './fallback'

const RemolContextReact = React.createContext(RemolContext.instance)
RemolContextReact.displayName = 'RemolReactContext'

/**
 * @example
 * ```tsx
  class App extends Remol {
    @field get $() {
      const logger = new Logger
      logger.id = () => this.props2.id

      return super.$.clone()
        .set(Logger.instance, logger)
    }
    sub() {
      return <div/>
    }
  }

  const App = Remol.fc(function App(props: { id: string }) {
    const $ = Remol.$
    const inner$ = Remol.mem0(() => {
      const logger = new Logger
      logger.id = () => props.id

      return $.clone()
        .set(Logger.instance, logger)
    })

    return <Remol.Provide value={inner$()}>{children}</Remol.Provide>
  })
 * ```
 */
export class Remol<Props = unknown> extends React.Component<Props, { error?: Error }> implements RemolWireHost<JSX.Element> {
  constructor(p: Props) {
    super(p)
    this.state = { error: undefined }
  }

  static get $() {
    return this.current!.context
  }

  static fc<Props>(Origin: React.FC<Props>) {
    Origin.displayName = Origin.displayName ?? Origin.name

    return remolComponentCopy(
      Origin,
      class extends this<Props> {
        static Origin = Origin
      }
    ) as new (p: Readonly<Props>) => Remol<Props>
  }

  static Provider = RemolContextReact.Provider

  static fallback(fallback: Remol['fallback']) {
    this.current!.fallback = fallback
  }

  static inputEventFix<E>(cb: (e: E) => unknown) {
    const ctx = this.current!

    return (e: E) => {
      cb(e)
      ctx.update()
    }
  }

  private static refGet() {
    const ctx = this.current!
    return (ctx.registry ?? (ctx.registry = []))[ctx.cursor++] as undefined
  }

  private static refSet<V>(v: V) {
    this.current!.registry![this.current!.cursor - 1] = v

    return v
  }

  static action<V extends Record<string, Function>>(obj: V) {
    return this.refGet() ?? this.refSet(RemolWireFunc.action(obj))
  }

  static mem0<V extends Record<string, Function>>(obj: V, index = 0) {
    return this.refGet() ?? this.refSet(RemolWireFunc.mem(obj, index))
  }

  static mem1<V extends Record<string, Function>>(obj: V) {
    return this.mem0(obj, 1)
  }

  static mem2<V extends Record<string, Function>>(obj: V) {
    return this.mem0(obj, 2)
  }

  static mem3<V extends Record<string, Function>>(obj: V) {
    return this.mem0(obj, 3)
  }

  toString() {
    return `${this.constructor.name}${(this.props as any)?.id ? `[${(this.props as any).id}]` : ''}`
  }

  [Symbol.toStringTag] = this.toString()

  protected static getDerivedStateFromError(error: Error) {
    return { error: RemolError.normalize(error) }
  }

  shouldComponentUpdate(next: Props, state: { error?: Error }, ctx: React.ContextType<typeof RemolContextReact>) {
    if (this.state?.error !== state.error) return true
    if (ctx !== this.context) return true
    if (!remolCompareDeep(this.props2, next)) {
      this.error = undefined
      ;(this as { state: { error?: Error } }).state.error = undefined
      return true
    }

    return false
  }

  context!: React.ContextType<typeof RemolContextReact>
  static contextType = RemolContextReact

  static Origin = undefined! as React.FC<any>

  get $() {
    return this.context
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  componentWillUnmount() {
    this.fiber.destructor()
    this.lastEl = null
    this.fiber = undefined!
    this.ChildrenView = undefined!
    this.FallbackView = undefined!
    this.cursor = 0
    this.registry = undefined
  }

  fallback(p: { error?: Error; children?: React.ReactNode; reset?(): void }) {
    return <RemolFallback children={p.children} error={p.error} reset={p.reset} />
  }

  cursor = 0
  registry = undefined as unknown[] | undefined
  lastEl = null as JSX.Element | null

  static current = undefined as Remol<any> | undefined

  reset() {
    this.error = undefined
    const error = this.state?.error
    if (error === undefined) this.update()
    else this.setState({ error: undefined })
  }

  private props2 = RemolWireFunc.field(this.props)

  private error: Error | undefined = undefined

  node() {
    // https://github.com/facebook/react/blob/790b5246f691adafbf4b6a4b3fe2e6cc1370c43e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L816
    if (this.error) return remolFail(this.error)

    try {
      Remol.current = this
      this.cursor = 0
      ;(this as { props: Props }).props = this.props2

      return (this.lastEl = this.sub())
    } catch (orig) {
      if (orig instanceof Promise) return remolFail(orig)
      this.error = RemolError.normalize(orig)

      return remolFail(this.error)
    }
  }

  update() {
    this.forceUpdate()
  }

  fiber = new RemolWire(this)
  FallbackView = this.fallback.bind(this)
  ChildrenView = remolComponentCopy(this.constructor, this.fiber.sync.bind(this.fiber))

  sub() {
    return (this.constructor as typeof Remol).Origin(this.props2)
  }

  render() {
    if (this.state?.error) this.error = this.state.error
    if (this.error) {
      const el = this.lastEl
      return this.fallback({
        error: this.error,
        children: el
          ? this.state?.error === undefined
            ? el
            : { ...el, props: { ...el.props, children: undefined } }
          : undefined,
        reset: this.reset.bind(this),
      })
    }

    const children = (
      <React.Suspense fallback={<this.FallbackView children={this.lastEl} />}>
        <this.ChildrenView />
      </React.Suspense>
    )

    return this.context === this.$ ? children : <Remol.Provider value={this.$} children={children} />
  }
}
