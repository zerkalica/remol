import React from 'react'

interface RemolErrorViewProps {
  error?: Error
  fallback: (props: { error?: Error }) => React.ReactElement
  children: React.ReactNode
}

export class RemolViewError extends React.Component<RemolErrorViewProps, { error?: Error }> {
  constructor(props: RemolErrorViewProps) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error: any) {
    if (!(error instanceof Error)) error = new Error(String(error), { cause: error })
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: {}) {}

  refresh = () => this.setState({ error: undefined })

  private static errorMap = new WeakMap<Error, { refresh(): void }>()
  private static attach(e: Error, view: { refresh(): void }) {
    this.errorMap.set(e, view)
  }

  static getRefresh(e: Error) {
    return this.errorMap.get(e)
  }

  static refresh(e: Error) {
    this.getRefresh(e)?.refresh()
  }

  render() {
    const error = this.state.error
    if (error) {
      RemolViewError.attach(error, this)
      return this.props.fallback(this.state)
    }

    return this.props.children
  }
}
