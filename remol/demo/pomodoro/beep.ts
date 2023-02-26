export async function beep(freq = 660, duration = 90) {
  var context = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  gain.gain.setValueAtTime(0, context.currentTime)
  gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.002)
  oscillator.connect(gain)
  oscillator.type = 'square'
  gain.connect(context.destination)
  oscillator.frequency.value = freq
  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + duration * 0.001)
  oscillator.onended = () => context.close()
}
