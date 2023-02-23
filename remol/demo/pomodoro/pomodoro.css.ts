import { css } from '@remol/react'

css(`
.remol_demo_pomodoro {
  background: gray;
  border: 1px solid #777;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.remol_demo_pomodoro_time {
  font-size: 120px;
  display: flex;
  justify-content: center;
  color: white;
  margin: 0;
}

.remol_demo_interval_controls,
.remol_demo_pomodoro_buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.remol_demo_pomodoro_buttons > button {
  padding: 1rem;
}
`)
