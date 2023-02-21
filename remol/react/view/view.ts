/* @global document */
import React from 'react'

import { RemolAtom, RemolBoxProps, RemolError } from '@remol/core'

import { RemolViewBox } from '../box/box'
import { RemolContextProvide } from '../context/context'
import { RemolViewObject } from '../object/object'
import { RemolViewError } from './error'

function normalizeName(name: string) {
  return name.trim().replace(/(-\w)/g, (_, part) => part.substring(1).toUpperCase())
}
export class RemolView extends RemolViewObject {
  id() {
    return ''
  }
  static h = React.createElement
  static doc = typeof document !== 'undefined' ? document : undefined

  private _atom: undefined | RemolAtom<this, unknown[], React.ReactElement | null> = undefined

  private get atom() {
    if (this._atom) return this._atom

    const atom = new RemolAtom<this, unknown[], React.ReactElement | null>(this.id(), this.render, this)

    this._atom = atom

    return atom
  }

  subscribe(emit: () => void) {
    return this.atom.subscribe(emit)
  }

  render(): React.ReactElement | null {
    return RemolView.h('div', null, 'RemolView')
  }

  width() {
    return 100
  }

  height() {
    return 50
  }

  snapshot(): React.ReactElement {
    const { Component, Fallback } = this
    const h = RemolView.h

    const children = h(RemolViewError, {
      fallback: Fallback,
      children: h(React.Suspense, { fallback: h(Fallback), children: h(Component) }),
    })
    const value = this._

    return value === this.__ ? children : h(RemolContextProvide, { value, children })
  }

  protected component() {
    this.errorFromDidCatch = undefined
    return this.atom.sync()
  }

  private _Component: undefined | (() => React.ReactElement | null) = undefined
  private get Component() {
    if (this._Component) return this._Component

    const component = () => this.component()
    this._Component = component
    Object.defineProperty(component, 'name', {
      value: `${this.id()}`,
    })

    return component
  }

  protected get dom() {
    return RemolView.doc?.getElementById(this.id())
  }

  fallbackStyle() {
    const el = this.dom
    const styles = {
      width: el ? undefined : this.width(),
      height: el ? undefined : this.height(),
    } as Record<string, string | number>

    const src = el?.getAttribute('style')

    if (!src) return styles

    src.split(';').forEach(pair => {
      const rec = pair.match(/(.*)\s*:\s*(.*)/)
      if (!rec) return
      const [, name, val] = rec
      styles[normalizeName(name)] = val.trim()
    })

    return styles
  }

  fallbackClass() {
    return this.dom?.getAttribute('class') ?? undefined
  }

  fallbackHtml() {
    const html = this.dom?.innerHTML
    if (!html) return undefined
    return { __html: html }
  }

  protected errorFromDidCatch?: Error | Promise<unknown> = undefined

  protected get error() {
    return this.atom.cache instanceof Error
      ? this.atom.cache
      : this.errorFromDidCatch instanceof Error
      ? this.errorFromDidCatch
      : undefined
  }

  errorAttribute() {
    return 'wire_view_error'
  }

  errorTitle() {
    return this.error ? this.error.message + (this.errorRetry ? ' ,click to retry' : '') : undefined
  }

  protected get errorRetry() {
    return this.error ? RemolError.get(this.error) : undefined
  }

  fallbackProps(): React.ComponentProps<'div'> & Object {
    return {
      style: this.fallbackStyle(),
      className: this.fallbackClass(),
      title: this.errorTitle(),
      [this.errorAttribute()]: this.error ? 'Error' : 'Promise',
      onClick: () => this.errorRetry?.(),
      dangerouslySetInnerHTML: this.fallbackHtml(),
    }
  }

  fallbackPropsWithOldAttrs() {
    const props = this.fallbackProps()
    const dom = this.dom

    dom?.getAttributeNames().forEach(name => {
      if (name === 'class' || props.hasOwnProperty(name)) return
      props[normalizeName(name) as keyof typeof props] = dom.getAttribute(name)
    })

    return props
  }

  tag() {
    return this.dom?.tagName.toLowerCase() ?? 'div'
  }

  fallback(p: { error?: Error }) {
    this.errorFromDidCatch = p.error ?? Promise.resolve()
    return RemolView.h(this.tag(), this.fallbackPropsWithOldAttrs())
  }

  private _Fallback: undefined | typeof this['fallback'] = undefined

  private get Fallback() {
    if (this._Fallback) return this._Fallback

    const fallback: typeof this['fallback'] = props => this.fallback(props)
    this._Fallback = fallback
    Object.defineProperty(fallback, 'name', {
      value: `${this.id()}#fallback`,
    })

    return fallback
  }

  static render<Instance>(
    this: {
      new (): Instance
    },
    config: RemolBoxProps<Instance>
  ) {
    const view = (
      this as unknown as {
        use<Instance extends RemolView>(config: RemolBoxProps<Instance>): Instance
      }
    ).use(config)

    const vdom = view.snapshot()

    // eslint-disable-next-line
    // const vdom = React.useSyncExternalStore(
    //   (e) => view.subscribe(e),
    //   () => view.snapshot()
    // );

    return vdom
  }

  static use<Instance>(
    this: {
      new (): Instance
    },
    config: Partial<Instance>
  ): Instance {
    const boxed = RemolViewBox.use(config) as Partial<Instance>
    const view = super.use.call(this, boxed) as RemolView

    // eslint-disable-next-line
    const [, emit] = React.useState([])

    // eslint-disable-next-line
    React.useEffect(() => view.subscribe(() => emit([])), [view])

    return view as Instance
  }
}
