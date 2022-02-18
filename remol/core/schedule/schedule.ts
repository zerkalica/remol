import { $mol_after_frame, $mol_object2, $mol_wire_auto } from 'mol_wire_lib'

export class RemolSchedule<Host extends { up(): void }> extends $mol_object2 {
  hosts = new Set<Host>()
  task: $mol_after_frame | null = null

  protected static sync = false

  // Workaround, to sync after react input to prevent cursor jumps https://github.com/facebook/react/issues/14904
  static schedule_sync() {
    this.sync = true
  }

  plan(host: Host) {
    this.hosts.add(host)

    if (RemolSchedule.sync) {
      RemolSchedule.sync = false
      this.task?.destructor()
      this.sync()
      return
    }

    if (this.task) return

    this.task = new $mol_after_frame(this.sync.bind(this))
  }

  destructor() {
    this.task?.destructor()
  }

  sync() {
    const prev = $mol_wire_auto()
    $mol_wire_auto(null)

    try {
      this.up()
    } finally {
      this.task = null
      $mol_wire_auto(prev)
    }
  }

  up() {
    while (this.hosts.size) {
      const hosts = Array.from(this.hosts)
      this.hosts.clear()

      for (const host of hosts) {
        host.up()
      }
    }
  }
}
