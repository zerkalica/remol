import React from 'react'

import { remolComponentCopy, RemolError, remolFailHidden, RemolWire, RemolWireHost, RemolWireObject } from '@remol/core'

import { RemolContextReact } from './context'
import { RemolFallback } from './fallback'

/**
 * @example
 * ```tsx
  class App extends Remol {
    @mem(0) inner$() {
      const logger = new Logger
      logger.id = () => this.props2.id

      return this.$.clone()
        .set(Logger.instance, logger)
    }
    sub() {
      return <Remol.Provide value={this.inner$()}>{children}</Remol.Provide>
    }
  }

  const App = Remol.fc(function App(props: { id: string }) {
    const $ = useRemolContext()
    const inner$ = Remol.memo(() => {
      const logger = new Logger
      logger.id = () => props.id

      return $.clone()
        .set(Logger.instance, logger)
    })
    )

    return <Remol.Provide value={inner$()}>{children}</Remol.Provide>
  })
 * ```
 */
export class Remol<Props = unknown> extends React.Component<Props, { error?: Error }> implements RemolWireHost<JSX.Element> {
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

  private static refGet() {
    const ctx = this.current!
    return (ctx.registry ?? (ctx.registry = []))[ctx.cursor++] as undefined
  }

  private static refSet<V>(v: V) {
    this.current!.registry![this.current!.cursor - 1] = v

    return v
  }

  static action<V extends Record<string, Function>>(obj: V) {
    return this.refGet() ?? this.refSet(RemolWireObject.action(obj))
  }

  static mem0<V extends Record<string, Function>>(obj: V, index = 0) {
    return this.refGet() ?? this.refSet(RemolWireObject.mem(obj, index))
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

  shouldComponentUpdate(next: Props) {
    // eslint-disable-next-line
    this.state = { error: undefined }

    RemolWireObject.update(this.props2, next)

    return true
  }

  context!: React.ContextType<typeof RemolContextReact>
  static contextType = RemolContextReact

  static Origin = undefined as undefined | React.FC<any>

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

  fallback(p: { error?: Error; children?: React.ReactNode; resetErrorBoundary?(): void }) {
    return <RemolFallback children={p.children} error={p.error} resetErrorBoundary={p.resetErrorBoundary} />
  }

  cursor = 0
  registry = undefined as unknown[] | undefined
  lastEl = null as JSX.Element | null

  static current = undefined as Remol<any> | undefined

  reset() {
    this.setState({ error: undefined })
  }

  props2 = RemolWireObject.props(this.props)

  node() {
    // https://github.com/facebook/react/blob/790b5246f691adafbf4b6a4b3fe2e6cc1370c43e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L816
    if (this.state?.error) return remolFailHidden(this.state.error)

    try {
      Remol.current = this
      this.cursor = 0
      this.lastEl = this.sub()
    } catch (orig) {
      if (orig instanceof Promise) return remolFailHidden(orig)

      const error = RemolError.normalize(orig)
      // eslint-disable-next-line
      this.state = { error }

      return remolFailHidden(error)
    }

    return this.lastEl
  }

  update() {
    this.forceUpdate()
  }

  fiber = new RemolWire(this)
  FallbackView = this.fallback.bind(this)
  ChildrenView = remolComponentCopy(this.constructor, this.fiber.sync.bind(this.fiber))

  sub() {
    return (this.constructor as typeof Remol).Origin!.call(this, this.props2)
  }

  render() {
    if (this.state?.error) {
      return this.fallback({
        error: this.state.error,
        children: this.lastEl,
        resetErrorBoundary: this.state.error ? this.reset.bind(this) : undefined,
      })
    }

    return (
      <React.Suspense fallback={<this.FallbackView children={this.lastEl} />}>
        <this.ChildrenView />
      </React.Suspense>
    )
  }
}
