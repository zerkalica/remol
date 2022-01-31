import { $mol_wire_pub_sub as pub_sub } from "mol_wire_lib";

export interface RemolWireHost<E> {
  node(): E | null;
  update(): void;
}

export class RemolWire<E> extends pub_sub {
  constructor(protected host: RemolWireHost<E>) {
    super();
  }

  up() {
    const bu = this.track_on();
    try {
      const result = this.host.node();
      this.track_cut();
      return result;
    } finally {
      this.track_off(bu);
    }
  }

  sync() {
    this.track_promote();
    return this.up();
  }

  stale() {
    if (super.stale()) {
      this.host.update();
      return true;
    }
    return false;
  }
}
