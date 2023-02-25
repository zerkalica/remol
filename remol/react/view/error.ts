import React from 'react'

interface WireErrorViewProps {
  error?: Error
  fallback: (props: { error?: Error }) => React.ReactElement
  children: React.ReactNode
}

type State = { ref: { error?: Error } }

export class RemolViewError extends React.Component<WireErrorViewProps, State> {
  constructor(props: WireErrorViewProps) {
    super(props)
    this.state = { ref: { error: undefined } }
  }

  static getDerivedStateFromError(error: any): State {
    if (!(error instanceof Error)) error = new Error(String(error), { cause: error })

    return { ref: { error } }
  }

  componentDidCatch(error: Error, errorInfo: {}) {}

  render() {
    const error = this.state.ref.error
    if (error) {
      // eslint-disable-next-line
      this.state.ref.error = undefined
      return this.props.fallback({ error })
    }

    return this.props.children
  }
}
