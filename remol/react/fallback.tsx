import React from 'react'

export function RemolFallback({
  id,
  error,
  klass = 'remol_fallback_suspend',
  children,
  minWidth,
  minHeight,
  resetErrorBoundary,
}: {
  resetErrorBoundary?(): void
  id?: string
  error?: Error
  klass?: string
  minWidth?: number
  minHeight?: number
  children?: React.ReactNode
}) {
  return (
    <div
      id={id}
      onClick={resetErrorBoundary}
      style={{ minWidth, minHeight }}
      className={`remol_fallback ${klass}`}
      data-status={error ? 'error' : 'loading'}
    >
      {children}
    </div>
  )
}

