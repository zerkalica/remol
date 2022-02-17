import * as React from 'react'

import { action } from '@remol/core'
import { Remol } from '@remol/react'

import { RemolDemoLocation } from '../../location/location'
import { RemolDemoTodoStore, TODO_FILTER } from '../store/store'
import { RemolTodoFooterTheme } from './theme'

export class RemolDemoTodoFooter extends Remol<{ id: string }> {
  static links = [
    {
      id: TODO_FILTER.ALL,
      title: 'All',
    },
    {
      id: TODO_FILTER.ACTIVE,
      title: 'Active',
    },
    {
      id: TODO_FILTER.COMPLETE,
      title: 'Completed',
    },
  ]

  css = RemolTodoFooterTheme.css

  linkCss(isSelected: boolean) {
    return isSelected ? this.css.linkSelected : this.css.linkRegular
  }

  get store() {
    return this.$.get(RemolDemoTodoStore.instance)
  }

  get location() {
    return this.$.get(RemolDemoLocation.instance)
  }

  filterLink(id: TODO_FILTER) {
    return this.location.url({ todo_filter: id })
  }

  @action
  clickLink(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const linkid = (e.target as any).dataset.linkid as TODO_FILTER | null | undefined
    if (!linkid) return
    this.store.filter(linkid)
  }

  sub({ id } = this.props, store = this.store) {
    if (store.activeTodoCount() === 0 && store.completedCount === 0) return null

    return (
      <footer id={id} className={this.css.footer}>
        <span className={this.css.todoCount} id={`${id}_count`}>
          <strong id={`${id}_number`}>{store.activeTodoCount()}</strong> item(s) left
        </span>
        <ul className={this.css.filters} id={`${id}_filters`}>
          {RemolDemoTodoFooter.links.map(link => (
            <li key={link.id} className={this.css.filterItem} id={`${id}_link["${link.id}"]`}>
              <a
                id={`${id}_link["${link.id}"].href`}
                className={this.linkCss(store.filter() === link.id)}
                href={this.filterLink(link.id)}
                data-linkid={link.id}
                onClick={this.clickLink}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
        {store.completedCount !== 0 && (
          <button id={`${id}_clear`} className={this.css.clearCompleted} disabled={store.pending} onClick={store.clearCompleted}>
            Clear completed
          </button>
        )}
      </footer>
    )
  }
}
