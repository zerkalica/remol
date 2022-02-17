import React from 'react'

import { remolCompareDeep, remolComponentCopy, RemolContext, RemolError, RemolWire, RemolWireFunc, RemolWireHost } from '@remol/core'

import { RemolFallback } from './fallback'

const RemolReactContext = React.createContext(RemolContext.instance)
RemolReactContext.displayName = 'RemolReactContext'

const registry = globalThis as unknown as { remol: Record<string, Remol> }

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
    const $ = Remol.use$()
    const inner$ = Remol.mem0(() => {
      const logger = new Logger
      logger.id = () => props.id

      return $.clone()
        .set(Logger.instance, logger)
    })

    return <Remol.Provide$ value={inner$()}>{children}</Remol.Provide$>
  })
 * ```
 */
export class Remol<Props = unknown>
  extends React.Component<Props, { error?: Error }>
  implements RemolWireHost<JSX.Element | null>
{
  constructor(p: Props) {
    super(p)
    this.state = { error: undefined }
    if (registry['remol'] === undefined) registry['remol'] = {}
    registry['remol'][this[Symbol.toStringTag]] = this
  }

  [Symbol.toStringTag] = (this.props as unknown as { id?: string })?.id ?? this.constructor.name

  static use$() {
    return this.current?.context ?? React.useContext(RemolReactContext)
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

  static Provide$ = RemolReactContext.Provider

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
    return this.refGet() ?? this.refSet(RemolWireFunc.action(obj))
  }

  static mem<V extends Record<string, Function>>(index: number, obj: V) {
    return this.refGet() ?? this.refSet(RemolWireFunc.mem(index, obj))
  }

  protected static getDerivedStateFromError(error: Error) {
    return { error: RemolError.normalize(error) }
  }

  shouldComponentUpdate(next: Props, state: { error?: Error }, ctx: React.ContextType<typeof RemolReactContext>) {
    if (this.state?.error !== state.error) {
      this.error = state.error
      return true
    }

    if (ctx !== this.context) return true

    if (!remolCompareDeep(this.props, next)) {
      return true
    }

    return false
  }

  context!: React.ContextType<typeof RemolReactContext>
  static contextType = RemolReactContext

  static Origin = undefined! as React.FC<any>

  get $() {
    return this.context
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  componentWillUnmount() {
    this.fiber.destructor()
    this.fiber = undefined!
    this.cursor = 0
    this.registry = undefined
    delete registry['remol'][this[Symbol.toStringTag]]
  }

  fallback(p: { error?: Error; children?: React.ReactNode; reset?(): void }) {
    return <RemolFallback children={p.children ?? null} error={p.error} reset={p.reset} />
  }

  cursor = 0
  registry = undefined as unknown[] | undefined

  static current = undefined as Remol<any> | undefined

  // private props2 = RemolWireFunc.field({ ...this.props })

  private error: Error | undefined = undefined

  node() {
    const prev = this.props
    try {
      Remol.current = this
      this.cursor = 0
      // ;(this as { props: Props }).props = this.props2

      const node = this.sub()
      if (this.context === this.$) return node
      return <RemolReactContext.Provider value={this.$} children={node} />
    } finally {
      // ;(this as any).props = prev
    }
  }

  fiber = new RemolWire<JSX.Element | null>(this, this[Symbol.toStringTag] + '.fiber')

  update() {
    this.forceUpdate()
  }

  sub() {
    return (this.constructor as typeof Remol).Origin(this.props)
  }

  static isServer = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

  render() {
    try {
      if (this.error) throw this.error
      return this.fiber.render()
    } catch (error: unknown) {
      if (error instanceof Promise && Remol.isServer) throw error
      if (error instanceof Error) console.error(error)
      this.error = undefined

      return this.fallback({
        error: error instanceof Promise ? undefined : RemolError.normalize(error),
      })
    }
  }
}
