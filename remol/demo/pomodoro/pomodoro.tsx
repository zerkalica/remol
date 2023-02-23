import './pomodoro.css.js'

import React from 'react'

import { action, AfterTimeout, solo } from '@remol/core'
import { RemolView } from '@remol/react'

import { beep } from './beep.js'

function leadZero(val: number) {
  return val < 10 ? `0${val}` : val
}

export class RemolDemoPomodoro extends RemolView {
  static view = (props: Partial<RemolDemoPomodoro>) => this.render(props)
  @solo status(next = 'work' as 'work' | 'break') {
    return next
  }

  @solo paused(next = true) {
    this.work_minutes()
    this.break_minutes() // set pause to true if interval changed

    return next
  }

  @solo work_minutes(val = 25) {
    return val
  }

  @solo break_minutes(val = 5) {
    return val
  }

  @solo limit_sec() {
    const val = this.status() === 'work' ? this.work_minutes() : this.break_minutes()

    return val * 60
  }

  @action.bound pause_toggle() {
    this.paused(!this.paused())
  }

  @action.bound decrement() {
    if (this.paused()) return
    const next = Math.max(0, this.remain_sec() - 1)
    this.remain_sec(next === 0 ? null : next)

    if (next > 0) return

    beep(this.status() === 'work' ? 1000 : 600)

    this.to_next_status()
  }

  @solo remain_sec(next?: null | number) {
    return next ?? this.limit_sec()
  }

  @solo time() {
    const sec = this.remain_sec()
    const timer = this.paused() ? undefined : new AfterTimeout(1000, this.decrement)

    return { min: Math.floor(sec / 60), sec: Math.floor(sec % 60), destructor: () => timer?.destructor() }
  }

  to_next_status() {
    this.status(this.status() === 'work' ? 'break' : 'work')
  }

  @action.bound next() {
    this.to_next_status()
    this.paused(true)
  }

  override render() {
    const id = this.id()
    const time = this.time()
    const status = this.status()

    return (
      <div
        id={this.id()}
        className="remol_demo_pomodoro"
        style={{
          backgroundColor: status === 'break' ? 'rgb(56, 133, 138)' : 'rgb(186, 73, 73)',
        }}
      >
        <h2 id={`${id}_time`} className="remol_demo_pomodoro_time">
          {leadZero(time.min)}:{leadZero(time.sec)}
        </h2>
        <div className="remol_demo_pomodoro_buttons">
          <button id={`${id}_button_work`} onClick={this.next}>
            {status === 'break' ? 'Work' : 'Break'}
          </button>
          <button id={`${id}_button_pause`} onClick={this.pause_toggle}>
            {this.paused() ? 'Continue' : 'Pause'}
          </button>
        </div>
        <div className="remol_demo_interval_controls">
          <label>
            Work{' '}
            <input
              type="number"
              id={`${id}_control_work`}
              min="1"
              max="300"
              step="10"
              value={this.work_minutes()}
              onChange={e => this.work_minutes(e.currentTarget.valueAsNumber || 1)}
            />{' '}
            min
          </label>
          <label>
            Break{' '}
            <input
              id={`${id}_control_break`}
              type="number"
              min="1"
              max="60"
              step="5"
              value={this.break_minutes()}
              onChange={e => this.break_minutes(e.currentTarget.valueAsNumber || 1)}
            />{' '}
            min
          </label>
        </div>
      </div>
    )
  }
}
