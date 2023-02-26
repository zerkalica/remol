import './pomodoro.css.js'

import React from 'react'

import { action, AfterTimeout, delay, solo } from '@remol/core'
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
    this.work_limit_min()
    this.break_limit_min() // set pause to true if interval changed
    return next
  }

  @solo work_limit_min(val = 25) {
    return val
  }

  @solo break_limit_min(val = 5) {
    return val
  }

  @solo limit_sec() {
    const val = this.status() === 'work' ? this.work_limit_min() : this.break_limit_min()

    return val * 60
  }

  @solo elapsed_sec(next = 0) {
    return next
  }

  left_sec() {
    return this.limit_sec() - this.elapsed_sec()
  }

  @action.bound elapsed_increment() {
    if (this.paused()) return
    const next = this.elapsed_sec() + 1
    this.elapsed_sec(next)

    let left_sec = this.left_sec()
    if (left_sec > 0) return
    if (this.muted()) return
    if (left_sec === 0) {
      return this.status() === 'work' ? this.remind_work_end() : this.remind_break_end()
    }
    if (!(left_sec % 60)) this.remind_overdue()
  }

  @solo muted(next = true) {
    return next
  }

  @action remind_overdue() {
    beep(440)
  }

  @action remind_work_end() {
    beep(2000)
    delay(500)
    beep(2000)
  }

  @action remind_break_end() {
    beep(600)
    delay(500)
    beep(600)
  }

  @solo left_time() {
    let sec = this.left_sec()
    const negative = sec < 0
    if (negative) sec = Math.abs(sec)
    const timer = this.paused() ? undefined : new AfterTimeout(1000, this.elapsed_increment)

    return {
      negative,
      min: Math.floor(sec / 60),
      sec: Math.floor(sec % 60),
      destructor: () => timer?.destructor(),
    }
  }

  @solo pomodoro_total(next = 0) {
    return next
  }

  @action.bound break() {
    this.status('break')
    this.elapsed_sec(0)
    this.paused(false)
  }

  @action.bound work() {
    if (!this.paused()) this.pomodoro_total(this.pomodoro_total() + 1)
    this.status('work')
    this.elapsed_sec(0)
    this.paused(false)
  }

  override render() {
    const id = this.id()
    const time = this.left_time()
    const status = this.status()

    return (
      <div id={this.id()} className="remol_demo_pomodoro" data-status={this.paused() ? undefined : status}>
        <h2 id={`${id}_time`} className="remol_demo_pomodoro_time">
          {time.negative ? '-' : ''} {leadZero(time.min)}:{leadZero(time.sec)}
        </h2>
        <div className="remol_demo_pomodoro_total">{this.pomodoro_total()} completed</div>
        <div className="remol_demo_pomodoro_buttons">
          <button id={`${id}_button_work`} onClick={this.work} data-status={status === 'work' ? status : undefined}>
            Work
          </button>
          <button id={`${id}_button_break`} onClick={this.break} data-status={status === 'break' ? status : undefined}>
            Break
          </button>
        </div>
        <div className="remol_demo_interval_controls">
          <label>
            <input
              type="number"
              id={`${id}_control_work`}
              min="1"
              max="300"
              step="10"
              value={this.work_limit_min()}
              onChange={e => this.work_limit_min(e.currentTarget.valueAsNumber || 1)}
            />
          </label>
          <label>
            <input
              id={`${id}_control_break`}
              type="number"
              placeholder="Break, min"
              min="1"
              max="60"
              step="5"
              value={this.break_limit_min()}
              onChange={e => this.break_limit_min(e.currentTarget.valueAsNumber || 1)}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              id={`${id}_control_break_long`}
              type="checkbox"
              checked={this.muted()}
              onChange={e => this.muted(!this.muted())}
            />{' '}
            Mute
          </label>
        </div>
      </div>
    )
  }
}
