import * as React from 'react'

import { action, field, RemolQueue } from '@remol/core'
import { RemolView } from '@remol/react'

import { RemolDemoLocation } from '../../location/location.js'
import { RemolDemoTodoStore, TODO_FILTER } from '../store/store.js'
import { RemolTodoFooterTheme } from './theme.js'

export class RemolDemoTodoFooter extends RemolView {
  static view = (p: Partial<RemolDemoTodoFooter>) => this.render(p)

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
    return this.ctx(RemolDemoTodoStore.single())
  }

  get location() {
    return this.ctx(RemolDemoLocation.single())
  }

  filterLink(id: TODO_FILTER) {
    return this.location.url({ todo_filter: id })
  }

  @action clickLink(
    e: React.MouseEvent<HTMLAnchorElement> & {
      target: {
        dataset?: {
          linkid?: TODO_FILTER | null
        }
      }
    }
  ) {
    e.preventDefault()
    const linkid = e.target?.dataset?.linkid
    if (!linkid) return
    this.store.filter(linkid)
  }

  @field get clearCompletedStatus() {
    return new RemolQueue()
  }

  @action clearCompleted(e: React.MouseEvent) {
    this.clearCompletedStatus.run(() => {
      this.store.clearCompleted()
    })
  }

  render() {
    const id = this.id()
    const store = this.store

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
                onClick={e => this.clickLink(e)}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
        {store.completedCount !== 0 && (
          <button
            id={`${id}_clear`}
            className={this.css.clearCompleted}
            disabled={this.clearCompletedStatus.pending}
            onClick={e => this.clearCompleted(e)}
          >
            Clear completed
          </button>
        )}
      </footer>
    )
  }
}
