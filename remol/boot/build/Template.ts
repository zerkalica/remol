export type RemolBootBuildTemplateScriptProps = { src: string }

export class RemolBootBuildTemplate {
  fileName() {
    return 'index.html'
  }

  titleText() {
    return `Dev ${this.pkgName()}`
  }

  headMeta() {
    return `
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, shrink-to-fit=no"
  />
  <title>${this.titleText()}</title>
`
  }

  noScript() {
    return 'You need to enable JavaScript to run this app.'
  }

  version() {
    return ''
  }

  pkgName() {
    return 'unk'
  }

  manifest(): undefined | { files: Record<string, string>; entries: Record<string, string> } {
    return undefined
  }

  lang() {
    return 'en'
  }

  rid() {
    return ''
  }

  error(): undefined | Error {
    return undefined
  }

  renderBodyFail() {
    const error = this.error()
    return `<h2>Что-то пошло не так</h2>
  <pre>Сообщите ID в тех-поддержку: <b>${this.rid()}</b></pre>
  ${error ? `<pre>${error.stack ?? 'unk'}</pre>` : ''}
`
  }

  publicUrl() {
    return ''
  }

  bodyJs(): readonly RemolBootBuildTemplateScriptProps[] {
    return []
  }

  renderPre() {
    return `<!doctype html><html lang="${this.lang()}">
  <head>
    ${this.headMeta()}
  </head>
  <body>
  <noscript>${this.noScript()}</noscript>
  <div id="${this.pkgName()}-main">
`
  }

  renderPost() {
    const manifest = this.manifest()
    const state = manifest && Object.keys(manifest.files).length ? { __files: manifest.files } : undefined
    const bodyJsManifest = manifest ? Object.values(manifest.entries).map(src => ({ src: this.publicUrl() + src })) : []
    const bodyJs = this.bodyJs()

    return `
    ${this.error() ? this.renderBodyFail() : ''}
  </div>
  ${
    state
      ? `<script id="${this.pkgName()}-state" type="application/json" crossorigin="anonymous">${JSON.stringify(state)}</script>`
      : ''
  }
  ${[...bodyJs, ...bodyJsManifest].map(item => `<script src="${item.src}"></script>`).join('\n')}
</body></html>
`
  }

  render() {
    return `${this.renderPre()}${this.renderPost()}`
  }
}
