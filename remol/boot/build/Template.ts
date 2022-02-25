export type RemolBootBuildTemplateScriptProps = { src?: string; body?: string }

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

  devJs(): readonly RemolBootBuildTemplateScriptProps[] {
    return []
  }

  rootId() {
    return `${this.pkgName()}_main`
  }

  stateId() {
    return `${this.pkgName()}_state`
  }

  renderPre() {
    return `<!doctype html><html lang="${this.lang()}">
  <head>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
    ${this.headMeta()}
  </head>
  <body>
  <noscript>${this.noScript()}</noscript>
  <div id="${this.rootId()}">
`
  }

  reloadPath() {
    return '/__reload'
  }

  renderPost() {
    const manifest = this.manifest()
    const state = manifest && Object.keys(manifest.files).length ? { __files: manifest.files } : undefined
    const bodyJsManifest = manifest ? Object.values(manifest.entries).map(src => ({ src: this.publicUrl() + src, body: '' })) : []
    const bodyJs = this.bodyJs()

    return `
    ${this.error() ? this.renderBodyFail() : ''}
  </div>
  ${
    state
      ? `<script id="${this.stateId()}" type="application/json" crossorigin="anonymous">${JSON.stringify(state)}</script>`
      : ''
  }
  ${[...bodyJs, ...bodyJsManifest, ...this.devJs()]
    .map(item => `<script${item.src ? ` src="${item.src}"` : ''}>${item.body ?? ''}</script>`)
    .join('\n')}
</body></html>
`
  }

  render() {
    return `${this.renderPre()}${this.renderPost()}`
  }
}
