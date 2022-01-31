import { css } from './css'

css(`
.remol_fallback_suspend {
  min-width: 2rem;
  min-height: 5rem;
  pointer-events: none;
}

.remol_fallback[data-status="loading"] {
  background-image: repeating-linear-gradient(
    45deg,
    hsla(0, 0%, 50%, 0.1) 0%,
    hsla(0, 0%, 50%, 0) 5%,
    hsla(0, 0%, 50%, 0) 45%,
    hsla(0, 0%, 50%, 0.1) 50%,
    hsla(0, 0%, 50%, 0) 55%,
    hsla(0, 0%, 50%, 0) 95%,
    hsla(0, 0%, 50%, 0.1) 100%
  );
  background-size: 200vmax 200vmax;
  animation: remol_suspend_loading 1s linear infinite;
}

@keyframes remol_suspend_loading {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 200vmax 0;
  }
}

.remol_fallback[data-status="error"] {
  background-image: repeating-linear-gradient(
    135deg,
    rgba(255, 220, 220, 1),
    rgba(255, 220, 220, 1) 11px,
    rgba(255, 255, 220, 1) 10px,
    rgba(255, 255, 220, 1) 20px
  );
  background-size: 28px 28px;
  color: black;
  animation: none;
  pointer-events: auto;
}
`)
