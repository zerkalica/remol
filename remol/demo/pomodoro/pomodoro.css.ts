import { css } from '@remol/react'

css(`
.remol_demo_pomodoro {
  background: gray;
  color: white;
  border-radius: 0.25rem;
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

.remol_demo_interval_controls > label > input {
  font-size: 1rem;
  padding: .1rem;
  border: none;
  border-radius: 0.25rem;
}

.remol_demo_interval_controls,
.remol_demo_pomodoro_buttons {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.remol_demo_interval_controls > label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.remol_demo_pomodoro_buttons > button {
  padding: .5rem .75rem;
  font-size: 1rem;
  border: none;
  width: 100%;
  border-radius: 0.25rem;
  background: white;
}

.remol_demo_pomodoro_buttons > button:hover {
  background-color: lightgray;
  cursor: pointer;
}

`)
