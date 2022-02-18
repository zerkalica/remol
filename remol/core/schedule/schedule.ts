import { $mol_after_frame, $mol_object2, $mol_wire_auto } from 'mol_wire_lib'

export class RemolSchedule<Host extends { up(): void }> extends $mol_object2 {
  hosts = new Set<Host>()
  task: $mol_after_frame | null = null

  plan(host: Host) {
    this.hosts.add(host)
    if (this.task) return

    this.task = new $mol_after_frame(this.sync.bind(this))
  }

  rewind() {
    this.task?.destructor()
    this.task = null
    this.sync()
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
