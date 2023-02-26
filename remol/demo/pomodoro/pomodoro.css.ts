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
  font-size: 18px;
}

.remol_demo_pomodoro[data-status="work"] {
  background: rgb(186, 73, 73);
}

.remol_demo_pomodoro[data-status="break"] {
  background: rgb(56, 133, 138);
}

.remol_demo_pomodoro_time {
  font-size: 120px;
  display: flex;
  justify-content: center;
  color: white;
  margin: 0;
}

.remol_demo_pomodoro_controls > label > input {
  font-size: 1rem;
  padding: .25rem;
  border: none;
  border-radius: 0.25rem;
}

.remol_demo_pomodoro_controls,
.remol_demo_pomodoro_buttons {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  justify-content: space-between;
}

.remol_demo_pomodoro_controls > label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.remol_demo_pomodoro_total {
  font-size: 48px;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.remol_demo_pomodoro_buttons > button {
  padding: .5rem .75rem;
  font-size: 1rem;
  border: none;
  width: 100%;
  border-radius: 0.25rem;
  background: lightgray;
}

.remol_demo_pomodoro_buttons > button[data-status="break"],
.remol_demo_pomodoro_buttons > button[data-status="work"] {
  background-color: white;
}

.remol_demo_pomodoro_buttons > button:hover {
  background-color: white;
  cursor: pointer;
}

`)
